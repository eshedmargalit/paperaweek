import { Application } from 'express';
import { IReview } from '../models/Review';
import UserModel, { IUser } from '../models/User';

interface Profile {
  userDisplayName?: string;
  reviews?: IReview[];
  isOwnPage?: boolean;
}

function filterUserData(user: IUser): Profile {
  if (user.publicProfile) {
    return {
      userDisplayName: user.displayName,
      reviews: user.reviews,
    };
  }

  return {};
}

module.exports = (app: Application) => {
  app.get('/api/profiles/:googleId', async (req, res) => {
    const { googleId } = req.params;
    const currentUserGoogleId = req.user ? req.user.googleId : null;
    const isOwnPage = googleId === currentUserGoogleId;

    try {
      const user = await UserModel.findOne({ googleId });

      if (!user) {
        res.status(404).send('No item found');
      } else {
        const filteredData = filterUserData(user);
        filteredData.isOwnPage = isOwnPage;
        res.send(JSON.stringify(filteredData));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
