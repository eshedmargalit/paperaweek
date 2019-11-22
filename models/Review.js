const mongoose = require("mongoose");
const { Schema } = mongoose;
const Paper = require("./Paper.js");

var ReviewSchema = new Schema(
  {
    paper: Paper,
    review: {
      summary_points: [{ type: String }],
      background_points: [{ type: String }],
      approach_points: [{ type: String }],
      results_points: [{ type: String }],
      conclusions_points: [{ type: String }],
      other_points: [{ type: String }]
    },
    _id: Schema.Types.ObjectId
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

mongoose.model("reviews", ReviewSchema);

module.exports = ReviewSchema;
