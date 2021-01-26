import argparse
import copy
import pprint
from typing import List

from pymongo import MongoClient


def get_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "source_uri", type=str, help="Mongo URI for the source database",
    )
    parser.add_argument(
        "source_db_name",
        type=str,
        help="Name of the database for the source database, e.g., 'paw'",
    )
    parser.add_argument(
        "target_uri", type=str, help="Mongo URI for the target database",
    )
    parser.add_argument(
        "target_db_name",
        type=str,
        help="Name of the database for the target database, e.g., 'paw'",
    )
    parser.add_argument("--dry_run", dest="dry_run", action="store_true")
    parser.add_argument("--no-dry_run", dest="dry_run", action="store_false")
    parser.set_defaults(dry_run=True)
    return parser


class Review:
    def __init__(self, data):
        self.data = data

    def convert_v1_to_v2(self) -> None:
        if self.data.get("paper") is None:
            return

        if self.data.get("notes") is not None:
            print("Review already converted, skipping")
            return

        original_review = copy.deepcopy(self.data)

        self.data["paper"].pop("one_sentence")
        self.data["paper"].pop("keywords")
        self.data.pop("review")
        self.data["notes"] = {
            "tldr": original_review["paper"]["one_sentence"],
            "keywords": original_review["paper"]["keywords"],
            "overview": original_review["review"]["summary_points"],
            "background": original_review["review"]["background_points"],
            "methods": original_review["review"]["approach_points"],
            "results": original_review["review"]["results_points"],
            "conclusions": original_review["review"]["conclusions_points"],
            "other": original_review["review"]["other_points"],
        }


class User:
    def __init__(self, db_object):
        self._db_object = db_object
        self._parse_db()

    def _parse_db(self):
        self.displayName = self._db_object["displayName"]
        self.googleId = self._db_object["googleId"]
        self.publicProfile = self._db_object.get("publicProfile", False)
        self.reviews = [Review(data) for data in self._db_object["reviews"]]
        self.drafts = [Review(data) for data in self._db_object["drafts"]]
        self.readingList = self._db_object["readingList"]

    def __repr__(self) -> str:
        return f"{self.displayName} ({self.googleId}) -- {len(self.reviews)} reviews"

    def convert_reviews_and_drafts(self) -> None:
        self._convert("reviews")
        self._convert("drafts")

    def _convert(self, attr: str):
        # backup
        data: List[Review] = getattr(self, attr)
        setattr(self, f"original_{attr}", data)

        # conversion
        for review in data:
            review.convert_v1_to_v2()

    def _convert_to_raw(self, items: List[Review]):
        """Converts from Review objects back to raw data"""
        assert isinstance(items, list)
        if len(items) == 0:
            return []

        assert isinstance(items[0], Review)

        return [item.data for item in items]

    def save_to_db(self, database: "Database", dry_run: bool = True) -> None:

        converted_reviews = self._convert_to_raw(self.reviews)
        converted_drafts = self._convert_to_raw(self.drafts)

        if dry_run:
            print("This is a dry run! No databases will be modified")
            print("Planning to update reviews with: ")
            pprint.pprint(converted_reviews)

            print("Planning to update drafts with: ")
            pprint.pprint(converted_drafts)
        else:
            print("This is not a dry run! Ahh!")
            # first, save self to db to make sure object exists
            db_object_without_immutables = copy.deepcopy(self._db_object)
            db_object_without_immutables.pop("_id")
            database.collection.find_one_and_update(
                {"googleId": self.googleId},
                {"$set": db_object_without_immutables},
                upsert=True,
            )

            # now update all values with converted values
            database.collection.find_one_and_update(
                {"googleId": self.googleId},
                {"$set": {"reviews": converted_reviews, "drafts": converted_drafts}},
                upsert=True,
            )


class Database:
    def __init__(self, db_name: str, uri: str):
        self.db_name = db_name
        self.uri = uri
        self._connect()

    def _connect(self):
        self.client = MongoClient(self.uri)
        self.collection = self.client[self.db_name]["users"]

    def get_all_users(self) -> List[User]:
        all_users = list(self.collection.find({"googleId": {"$exists": True}}))
        return [User(data) for data in all_users]

    def get_user_by(self, attr: str, value: str) -> User:
        return User(self.collection.find_one({attr: value}))


def main() -> None:
    args = get_parser().parse_args()
    source = Database(args.source_db_name, args.source_uri)
    target = Database(args.target_db_name, args.target_uri)

    for user in source.get_all_users():
        print(user)
        print("==================")
        user.convert_reviews_and_drafts()
        user.save_to_db(target, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
