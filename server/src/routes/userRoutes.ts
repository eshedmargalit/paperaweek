import { Application } from 'express';
import UserModel from '../models/User';
import requireLogin from '../middlewares/requireLogin';

module.exports = (app: Application) => {
  app.put('/api/user', requireLogin, async (req, res) => {
    const filter = { googleId: req.user.googleId };
    const update = req.body;

    try {
      const user = await UserModel.findOneAndUpdate(
        filter,
        update,
        { new: true } // return updated post
      );
      if (!user) {
        res.status(404).send('No item found');
      } else {
        res.send(JSON.stringify(user));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
