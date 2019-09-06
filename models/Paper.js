const mongoose = require("mongoose");
const { Schema } = mongoose;

var PaperSchema = new Schema(
  {
    metadata: {
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
    review: {
      summary_points: [{ type: String }],
      background_points: [{ type: String }],
      approach_points: [{ type: String }],
      results_points: [{ type: String }],
      conclusions_points: [{ type: String }],
      other_points: [{ type: String }]
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

mongoose.model("papers", PaperSchema);
