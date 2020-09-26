const mongoose = require("mongoose");
const { Schema } = mongoose;
const PaperSchema = require("./Paper.js");
const ReviewSchema = require("./Review.js");

var UserSchema = new Schema(
  {
    googleId: String,
    displayName: String,
    readingList: [PaperSchema],
    reviews: [ReviewSchema],
    drafts: [ReviewSchema],
    lastLogin: Date,
    publicProfile: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

mongoose.model("users", UserSchema);
