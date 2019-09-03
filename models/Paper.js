const mongoose = require('mongoose');
const { Schema } = mongoose;


var PaperSchema = new Schema(
  {
    metadata: {
      title: String,
      authors: [{type: String}],
      institutions: [{type: String}],
      date: String,
      journal: String,
      doi: String,
      url: String,
      keywords: [{type: String}],
      review_date: Date,
      one_sentence: String,
    },
    review: {
      summary: [{type: String}],
      background: [{type: String}],
      approach: [{type: String}],
      results: [{type: String}],
      conclusions: [{type: String}],
      other: [{type: String}],
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

mongoose.model('papers', PaperSchema);
