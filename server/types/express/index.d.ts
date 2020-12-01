import { Express } from 'express-serve-static-core';
import { UserDocument } from '../../models/User';

declare module 'express-serve-static-core' {
  export interface Request {
    user: UserDocument;
  }
}
