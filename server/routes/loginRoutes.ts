import UserModel from '../models/User';
import requireLogin from '../middlewares/requireLogin';
import { Application } from 'express';

module.exports = (app: Application) => {
  app.get('/api/lastLogin', requireLogin, async (req, res) => {
    let d = Date.now();
    req.user.lastLogin = d;
    req.user.save();
    res.send(JSON.stringify(req.user));
  });
};
