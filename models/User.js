const mongoose = require("mongoose");
const { Schema } = mongoose;
const PaperSchema = require("./Paper.js");
const ReviewSchema = require("./Review.js");

var UserSchema = new Schema(
  {
    unique_id: String,
    display_name: String,
    reading_list: [PaperSchema],
    reviews: [ReviewSchema],
    drafts: [ReviewSchema]
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

mongoose.model("users", UserSchema);
