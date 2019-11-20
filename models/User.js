const mongoose = require("mongoose");
const { Schema } = mongoose;
const Paper = require("./Paper.js");
const Review = require("./Review.js");

var UserSchema = new Schema(
  {
    unique_id: String,
    display_name: String,
    reading_list: [Paper],
    reviews: [Review]
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

mongoose.model("users", UserSchema);
