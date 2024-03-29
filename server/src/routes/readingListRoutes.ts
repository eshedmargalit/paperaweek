import { Application } from 'express';
import requireLogin from '../middlewares/requireLogin';

module.exports = (app: Application) => {
  app.put('/api/readingList', requireLogin, async (req, res) => {
    req.user.readingList = req.body;
    req.user.save();
    res.send(JSON.stringify(req.user.readingList));
  });
};
