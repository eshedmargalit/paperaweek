import UserModel, { IUser } from '../models/User';
import PaperModel from '../models/Paper';
import { Types } from 'mongoose';
import requireLogin from '../middlewares/requireLogin';
import { Application } from 'express';

module.exports = (app: Application) => {
  app.get('/api/drafts', requireLogin, async (req, res) => {
    let user = await UserModel.findById((req.user as IUser).googleId);
    if (!user) throw 'TODO';

    res.send(JSON.stringify(user.drafts));
  });

  app.post('/api/drafts', requireLogin, async (req, res) => {
    const draft = req.body.draft;
    let newPaper = new PaperModel(draft.paper);
    let newReview = {
      paper: newPaper,
      review: draft.review,
      _id: new Types.ObjectId(),
    };
    let user = await UserModel.findOne({ googleId: (req.user as IUser).googleId });
    if (!user) throw 'TODO';
    user.drafts.push(newReview);
    user.save();
    res.send(JSON.stringify(newReview));
  });

  app.put('/api/drafts', requireLogin, async (req, res) => {
    const draft = req.body.draft;
    try {
      let newPaper = new PaperModel(draft.paper);
      let user = await UserModel.findOneAndUpdate(
        {
          googleId: (req.user as IUser).googleId,
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
        { googleId: (req.user as IUser).googleId },
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
