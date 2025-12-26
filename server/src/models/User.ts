import { Document, Schema, model } from 'mongoose';

import Paper, { PaperDocument } from './Paper';
import Review, { ReviewDocument } from './Review';

export interface IUser {
  googleId: string;
  displayName: string;
  readingList: PaperDocument[];
  reviews: ReviewDocument[];
  drafts: ReviewDocument[];
  publicProfile: boolean;
  lastLogin?: number;
}

export interface UserDocument extends Document, IUser {}

const UserSchema = new Schema(
  {
    googleId: String,
    displayName: String,
    readingList: [Paper.schema],
    reviews: [Review.schema],
    drafts: [Review.schema],
    publicProfile: { type: Boolean, default: false },
    lastLogin: Number,
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export default model<UserDocument>('users', UserSchema);
