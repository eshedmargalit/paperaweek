import { Application } from 'express';
import UserModel, { IUser } from '../models/User';

function filterUserData(user: IUser) {
  if (user.publicProfile) {
    return {
      userDisplayName: user.displayName,
      reviews: user.reviews,
    };
  } else {
    return {
      userDisplayName: null,
      reviews: null,
    };
  }
}

module.exports = (app: Application) => {
  app.get('/api/profiles/:googleId', async (req, res) => {
    const googleId = req.params.googleId;
    const currentUserGoogleId = req.user ? (req.user as IUser).googleId : null;
    const isOwnPage = googleId === currentUserGoogleId;

    try {
      let user = await UserModel.findOne({ googleId: googleId });

      if (!user) {
        res.status(404).send('No item found');
      } else {
        // TODO AM
        let filteredData: any = filterUserData(user);
        filteredData.isOwnPage = isOwnPage;
        res.send(JSON.stringify(filteredData));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
