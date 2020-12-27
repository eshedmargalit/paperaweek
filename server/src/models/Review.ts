import { Schema, model, Document } from 'mongoose';
import Paper, { IPaper } from './Paper';

export interface IReview {
  paper: IPaper;
  notes: {
    overview: string[];
    background: string[];
    methods: string[];
    results: string[];
    conclusions: string[];
    other: string[];
    tldr: string;
    keywords: string[];
  };
}

export interface ReviewDocument extends IReview, Document {}

const ReviewSchema = new Schema(
  {
    paper: Paper.schema,
    notes: {
      overview: [{ type: String }],
      background: [{ type: String }],
      methods: [{ type: String }],
      results: [{ type: String }],
      conclusions: [{ type: String }],
      other: [{ type: String }],
      tldr: String,
      keywords: [{ type: String }],
    },
    _id: Schema.Types.ObjectId,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export default model<ReviewDocument>('reviews', ReviewSchema);
