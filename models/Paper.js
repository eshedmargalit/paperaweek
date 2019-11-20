const mongoose = require("mongoose");
const { Schema } = mongoose;

var PaperSchema = new Schema(
  {
    title: String,
    authors: [{ type: String }],
    institutions: [{ type: String }],
    date: String,
    journal: String,
    doi: String,
    url: String,
    keywords: [{ type: String }],
    one_sentence: String,
    review_date: String
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

mongoose.model("papers", PaperSchema);
