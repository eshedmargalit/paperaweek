import { Document, Schema, model } from 'mongoose';

import Paper from './Paper';
import Review from './Review';

export interface IUser extends Document {
  googleId: string;
  reviews: any[];
  readingList: any[];
  drafts: any[];
  lastLogin: any;
  publicProfile: any;
  displayName: string;
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
