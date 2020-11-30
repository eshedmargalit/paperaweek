import UserModel from '../models/User';
import ReviewModel from '../models/Review';
import PaperModel from '../models/Paper';
import { Types } from 'mongoose';
import requireLogin from '../middlewares/requireLogin';
import { Application } from 'express';

module.exports = (app: Application) => {
  app.get('/api/drafts', requireLogin, async (req, res) => {
    res.send(JSON.stringify(req.user.drafts));
  });

  app.post('/api/drafts', requireLogin, async (req, res) => {
    const draft = req.body.draft;

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
    const draft = req.body.draft;
    try {
      let newPaper = new PaperModel(draft.paper);
      let user = await UserModel.findOneAndUpdate(
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
        function(err, draft) {
          if (err) {
            console.log(err);
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
