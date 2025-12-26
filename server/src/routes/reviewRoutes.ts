import { Application } from 'express';
import { Types } from 'mongoose';
import requireLogin from '../middlewares/requireLogin';
import UserModel from '../models/User';
import PaperModel from '../models/Paper';
import ReviewModel from '../models/Review';

module.exports = (app: Application) => {
  app.post('/api/reviews', requireLogin, async (req, res) => {
    const { review } = req.body;
    const { paper, notes } = review;
    const newReview = new ReviewModel({
      paper: new PaperModel(paper),
      notes,
      _id: new Types.ObjectId(),
    });

    req.user!.reviews.push(newReview);
    req.user!.save();
    res.send(JSON.stringify(req.user!.reviews));
  });

  app.put('/api/reviews', requireLogin, async (req, res) => {
    const { review } = req.body;
    const { paper, notes } = review;
    try {
      const newPaper = new PaperModel(paper);
      const user = await UserModel.findOneAndUpdate(
        {
          googleId: req.user!.googleId,
          'reviews._id': new Types.ObjectId(req.body.id),
        },
        {
          $set: {
            'reviews.$.paper': newPaper,
            'reviews.$.notes': notes,
          },
        },
        { new: true } // return updated post
      );
      if (!user) {
        res.status(404).send('No item found');
      } else {
        res.send(JSON.stringify(user.reviews));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete('/api/reviews/:id', requireLogin, async (req, res) => {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { googleId: req.user!.googleId },
        {
          $pull: {
            reviews: { _id: new Types.ObjectId(req.params.id) },
          },
        },
        { new: true }
      );
      if (updatedUser) {
        res.send(JSON.stringify(updatedUser));
      } else {
        res.status(404).send('User or review not found');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
