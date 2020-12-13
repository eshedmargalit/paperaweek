import { Schema, model, Document } from 'mongoose';
import Paper, { IPaper } from './Paper';

export interface IReview {
  paper: IPaper;
  review: {
    summary_points: string[];
    background_points: string[];
    approach_points: string[];
    results_points: string[];
    conclusions_points: string[];
    other_points: string[];
  };
}

export interface ReviewDocument extends IReview, Document {}

const ReviewSchema = new Schema(
  {
    paper: Paper.schema,
    review: {
      summary_points: [{ type: String }],
      background_points: [{ type: String }],
      approach_points: [{ type: String }],
      results_points: [{ type: String }],
      conclusions_points: [{ type: String }],
      other_points: [{ type: String }],
    },
    _id: Schema.Types.ObjectId,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export default model<ReviewDocument>('reviews', ReviewSchema);
