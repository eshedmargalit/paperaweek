import UserModel, { IUser } from '../models/User';
import { Application } from 'express';
import requireLogin from '../middlewares/requireLogin';

module.exports = (app: Application) => {
  app.put('/api/readingList', requireLogin, async (req, res) => {
    let user = await UserModel.findOne({ googleId: (req.user as IUser).googleId });
    if (!user) throw Error('TODO');
    user.readingList = req.body;
    user.save();
    res.send(JSON.stringify(user.readingList));
  });
};
