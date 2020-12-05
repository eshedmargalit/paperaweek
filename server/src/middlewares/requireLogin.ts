import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/User';

// We can return either a response with an error object or nothing. If everything succeeds, we can safely return nothing.
type LoginMiddleware = Promise<Response<{ error: string }> | undefined>;

export default async (req: Request, res: Response, next: NextFunction): LoginMiddleware => {
  // If the request user doesn't exist at all, send back a 401
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  }

  // If the request does have an associated googleId, pull from the DB and attach to the req object
  const { googleId } = req.user;
  const user = await UserModel.findOne({ googleId });

  if (!user) {
    return res.status(404).send({ error: `Could not find user with Google ID: ${googleId}` });
  }

  // Set the user so we can use it in the next handler in the chain
  req.user = user;
  next();
};
