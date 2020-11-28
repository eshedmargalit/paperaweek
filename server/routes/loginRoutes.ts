import UserModel, { IUser } from '../models/User';
import requireLogin from '../middlewares/requireLogin';
import { Application } from 'express';

module.exports = (app: Application) => {
  app.get('/api/lastLogin', requireLogin, async (req, res) => {
    let user = await UserModel.findOne({ googleId: (req.user as IUser).googleId });
    if (!user) throw Error('Todo');
    let d = Date.now();
    user.lastLogin = d;
    user.save();
    res.send(JSON.stringify(user));
  });
};
