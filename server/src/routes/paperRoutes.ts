import { Application } from 'express';
import { Types } from 'mongoose';
import requireLogin from '../middlewares/requireLogin';
import UserModel from '../models/User';
import PaperModel from '../models/Paper';
import ReviewModel from '../models/Review';

module.exports = (app: Application) => {
  app.post('/api/papers', requireLogin, async (req, res) => {
    const { review } = req.body;
    const newPaper = new PaperModel(review.paper);
    const newReview = new ReviewModel({
      paper: newPaper,
      review: review.review,
      _id: new Types.ObjectId(),
    });

    req.user.reviews.push(newReview);
    req.user.save();
    res.send(JSON.stringify(req.user.reviews));
  });

  app.put('/api/papers', requireLogin, async (req, res) => {
    const { review } = req.body;
    try {
      const newPaper = new PaperModel(review.paper);
      const user = await UserModel.findOneAndUpdate(
        {
          googleId: req.user.googleId,
          'reviews._id': Types.ObjectId(req.body.id),
        },
        {
          $set: {
            'reviews.$.paper': newPaper,
            'reviews.$.review': review.review,
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

  app.delete('/api/papers/:id', requireLogin, async (req, res) => {
    try {
      UserModel.findOneAndUpdate(
        { googleId: req.user.googleId },
        {
          $pull: {
            reviews: { _id: Types.ObjectId(req.params.id) },
          },
        },
        { new: true },
        (err, review) => {
          if (err) {
            console.log(err);
          } else {
            res.send(JSON.stringify(review));
          }
        }
      );
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
