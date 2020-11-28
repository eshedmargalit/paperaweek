import { Schema, model, Document } from 'mongoose';
import Paper from './Paper';

export interface IReview extends Document {
  paper: any;
}

var ReviewSchema = new Schema(
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

export default model<IReview>('reviews', ReviewSchema);
