import { Types } from 'mongoose';
import { Application } from 'express';
import UserModel from '../models/User';
import ReviewModel from '../models/Review';
import PaperModel from '../models/Paper';
import requireLogin from '../middlewares/requireLogin';

module.exports = (app: Application) => {
  app.get('/api/drafts', requireLogin, async (req, res) => {
    res.send(JSON.stringify(req.user.drafts));
  });

  app.post('/api/drafts', requireLogin, async (req, res) => {
    const { draft } = req.body;

    const newPaper = new PaperModel(draft.paper);
    const newReview = new ReviewModel({
      paper: newPaper,
      review: draft.review,
      _id: new Types.ObjectId(),
    });

    req.user.drafts.push(newReview);
    req.user.save();
    res.send(JSON.stringify(newReview));
  });

  app.put('/api/drafts', requireLogin, async (req, res) => {
    const { draft } = req.body;
    try {
      const newPaper = new PaperModel(draft.paper);
      const user = await UserModel.findOneAndUpdate(
        {
          googleId: req.user.googleId,
          'drafts._id': Types.ObjectId(req.body.id),
        },
        {
          $set: {
            'drafts.$.paper': newPaper,
            'drafts.$.review': draft.review,
          },
        },
        { new: true } // return updated post
      );
      if (!user) {
        res.status(404).send('No item found');
      } else {
        res.send(JSON.stringify(user.drafts[user.drafts.length - 1]));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete('/api/drafts/:id', requireLogin, async (req, res) => {
    try {
      UserModel.findOneAndUpdate(
        { googleId: req.user.googleId },
        {
          $pull: {
            drafts: { _id: new Types.ObjectId(req.params.id) },
          },
        },
        { new: true },
        (err, draft) => {
          if (err) {
            console.error(err);
          } else {
            res.send(JSON.stringify(draft));
          }
        }
      );
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
