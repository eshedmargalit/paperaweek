import { Application } from 'express';
import requireLogin from '../middlewares/requireLogin';

module.exports = (app: Application) => {
  app.get('/api/lastLogin', requireLogin, async (req, res) => {
    const d = Date.now();
    req.user!.lastLogin = d;
    req.user!.save();
    res.send(JSON.stringify(req.user));
  });
};
