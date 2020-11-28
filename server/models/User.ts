import { Document, Schema, model } from 'mongoose';

import Paper, { IPaper } from './Paper';
import Review, { IReview } from './Review';

export interface IUser extends Document {
  googleId: string;
  displayName: string;
  readingList: IPaper[];
  reviews: IReview[];
  drafts: IReview[];
  lastLogin: number;
  publicProfile: boolean;
  renderMath: boolean;
}

var UserSchema = new Schema(
  {
    googleId: String,
    displayName: String,
    readingList: [Paper.schema],
    reviews: [Review.schema],
    drafts: [Review.schema],
    lastLogin: Date,
    publicProfile: { type: Boolean, default: false },
    renderMath: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export default model<IUser>('users', UserSchema);
