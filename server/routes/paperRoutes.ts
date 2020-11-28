const mongoose = require('mongoose');
const User = mongoose.model('users');
const Paper = mongoose.model('papers');
import { Application } from 'express';
import requireLogin from '../middlewares/requireLogin';
import UserModel, { IUser } from '../models/User';

module.exports = (app: Application) => {
  app.post('/api/papers', requireLogin, async (req, res) => {
    const review = req.body.review;
    let newPaper = new Paper(review.paper);
    let newReview = {
      paper: newPaper,
      review: review.review,
      _id: new mongoose.Types.ObjectId(),
    };
    let user = await UserModel.findOne({ googleId: (req.user as IUser).googleId });
    if (!user) {
      throw Error('...');
    }
    user.reviews.push(newReview);
    user.save();
    res.send(JSON.stringify(user.reviews));
  });

  app.put('/api/papers', requireLogin, async (req, res) => {
    const review = req.body.review;
    try {
      let newPaper = new Paper(review.paper);
      let user = await User.findOneAndUpdate(
        {
          googleId: (req.user as IUser).googleId,
          'reviews._id': mongoose.Types.ObjectId(req.body.id),
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
        { googleId: (req.user as IUser).googleId },
        {
          $pull: {
            reviews: { _id: new mongoose.Types.ObjectId(req.params.id) },
          },
        },
        { new: true },
        function(err, review) {
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
