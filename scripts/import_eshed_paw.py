import argparse
import bson
import glob
import ipdb
import json
import pprint
from datetime import datetime
import dateutil.parser
from pymongo import MongoClient

JSON_DIR = (
    "/Users/eshed/projects/eshedmargalit.github.io/src/json/paper_reviews/review_jsons"
)
DB_NAME = "test"

GOOGLEID = "113214769483919341732"


def convert_json(j):
    """
    Converts json to match format in MongoDB
    """

    # remove existing mongo data
    j.pop("_id", None)
    j.pop("__v", None)

    # change 'metadata' to 'paper'
    j["paper"] = j.pop("metadata")

    # add _points to review fields
    review_keys = list(j["review"].keys())
    review = {}
    for key in review_keys:
        review[f"{key}_points"] = j["review"].pop(key)

    j["review"] = review

    # add createdAt and updatedAt field
    review_date = j["paper"].pop("review_date")
    j["createdAt"] = dateutil.parser.isoparse(review_date)
    j["updatedAt"] = dateutil.parser.isoparse(review_date)

    # reverse author orders
    authors = list(j["paper"]["authors"])
    new_authors = []
    for author in authors:
        parts = [x.strip() for x in author.split(",")]
        if len(parts) > 1:
            last_name, initials = parts
            new_authors.append(f"{initials} {last_name}")
        else:
            new_authors.append(parts[0])

    j["paper"]["authors"] = new_authors

    # add _id to paper field
    j["paper"]["createdAt"] = dateutil.parser.isoparse(review_date)
    j["paper"]["updatedAt"] = dateutil.parser.isoparse(review_date)
    j["_id"] = bson.objectid.ObjectId()
    return j


def load_jsons(json_dir):
    """
    Loads json objects
    """
    filenames = glob.glob(f"{json_dir}/*.json")
    converted_jsons = []
    for filename in filenames:
        with open(filename, "r") as f:
            loaded_json = json.load(f)
            converted_jsons.append(convert_json(loaded_json))

    return converted_jsons


def main():
    client = MongoClient(ARGS.mongo_uri)
    collection = client[DB_NAME]["users"]
    eshed = collection.find_one({"googleId": GOOGLEID})
    eshed_reviews = eshed["reviews"]
    converted_jsons = load_jsons(JSON_DIR)

    # attempt to insert one
    for cj in converted_jsons:
        eshed_reviews.append(cj)
    eshed["reviews"] = eshed_reviews
    pprint.pprint(eshed_reviews[38])

    collection.update_one(
        {"googleId": GOOGLEID}, {"$set": {"reviews": eshed_reviews}}, upsert=True
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "mongo_uri", type=str, help="mongo URI that identifies database"
    )
    parser.parse_args()
    main()
