import { Application } from 'express';
import { IReview } from '../models/Review';
import UserModel, { IUser } from '../models/User';

interface FilteredData {
  userDisplayName?: string;
  reviews?: IReview[];
  isOwnPage?: boolean;
}

function filterUserData(user: IUser): FilteredData {
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
    const googleId = req.params.googleId;
    const currentUserGoogleId = req.user ? req.user.googleId : null;
    const isOwnPage = googleId === currentUserGoogleId;

    try {
      let user = await UserModel.findOne({ googleId: googleId });

      if (!user) {
        res.status(404).send('No item found');
      } else {
        let filteredData = filterUserData(user);
        filteredData.isOwnPage = isOwnPage;
        res.send(JSON.stringify(filteredData));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
