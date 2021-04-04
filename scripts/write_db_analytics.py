import argparse
import copy
import datetime
import os
import pprint
from typing import List

import pandas as pd
from pymongo import MongoClient
from scipy.stats import scoreatpercentile


def get_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "db_uri", type=str, help="Mongo URI",
    )
    parser.add_argument(
        "db_name", type=str, help="Name of the database, e.g., 'paw'",
    )
    parser.set_defaults(dry_run=True)
    return parser


class User:
    def __init__(self, db_object):
        self._db_object = db_object
        self._parse_db()

    def _parse_db(self):
        self.displayName = self._db_object["displayName"]
        self.googleId = self._db_object["googleId"]
        self.publicProfile = self._db_object.get("publicProfile", False)
        self.reviews = self._db_object["reviews"]
        self.drafts = self._db_object["drafts"]

    def __repr__(self) -> str:
        return f"{self.displayName} ({self.googleId}) -- {len(self.reviews)} reviews"


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
    db = Database(args.db_name, args.db_uri)

    users = db.get_all_users()

    print("10 most recent users: ")
    for user in users[-10:]:
        print(user)

    active_users = list(filter(lambda user: len(user.reviews) > 0, users))

    # get user stats
    todays_date = datetime.datetime.now()
    num_users = len(users)

    num_reviews_per_user = [len(user.reviews) for user in users]
    num_drafts_per_user = [len(user.drafts) for user in users]
    number_public = sum([user.publicProfile for user in users])

    data = pd.DataFrame(
        {
            "Date": todays_date,
            "Number of Accounts": len(users),
            "Number of Active Accounts": len(active_users),
            "Number of Public Profiles": number_public,
            "Number Reviews (10th %ile)": scoreatpercentile(num_reviews_per_user, 10),
            "Number Reviews (75th %ile)": scoreatpercentile(num_reviews_per_user, 75),
            "Number Reviews (90th %ile)": scoreatpercentile(num_reviews_per_user, 90),
            "Number Reviews (95th %ile)": scoreatpercentile(num_reviews_per_user, 95),
            "Number Drafts (10th %ile)": scoreatpercentile(num_drafts_per_user, 10),
            "Number Drafts (75th %ile)": scoreatpercentile(num_drafts_per_user, 75),
            "Number Drafts (90th %ile)": scoreatpercentile(num_drafts_per_user, 90),
            "Number Drafts (95th %ile)": scoreatpercentile(num_drafts_per_user, 95),
        },
        index=[0],
    )

    output_path = "paw_stats.csv"
    data.to_csv(output_path, mode="a", header=not os.path.exists(output_path))


if __name__ == "__main__":
    main()
