import { Schema, model, Document } from 'mongoose';

export interface IPaper extends Document {
  title: string;
}

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
    review_date: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export default model<IPaper>('papers', PaperSchema);
