import { Document, Schema, model } from 'mongoose';

import Paper, { PaperDocument } from './Paper';
import Review, { ReviewDocument } from './Review';

export interface IUser {
  googleId: string;
  displayName: string;
  readingList: PaperDocument[];
  reviews: ReviewDocument[];
  drafts: ReviewDocument[];
  lastLogin: number;
  publicProfile: boolean;
  renderMath: boolean;
}

export interface UserDocument extends Document, IUser {}

const UserSchema = new Schema(
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

export default model<UserDocument>('users', UserSchema);
