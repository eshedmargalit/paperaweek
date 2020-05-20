const mongoose = require("mongoose");
const User = mongoose.model("users");
const Paper = mongoose.model("papers");
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  app.get("/api/drafts", requireLogin, async (req, res) => {
    let user = await User.findById(req.user.googleId);
    res.send(JSON.stringify(user.drafts));
  });

  app.post("/api/drafts", requireLogin, async (req, res) => {
    const draft = req.body.draft;
    let newPaper = new Paper(draft.paper);
    let newReview = {
      paper: newPaper,
      review: draft.review,
      _id: new mongoose.Types.ObjectId()
    };
    let user = await User.findOne({ googleId: req.user.googleId });
    user.drafts.push(newReview);
    user.save();
    res.send(JSON.stringify(newReview));
  });

  app.put("/api/drafts", requireLogin, async (req, res) => {
    const draft = req.body.draft;
    try {
      let newPaper = new Paper(draft.paper);
      let user = await User.findOneAndUpdate(
        {
          googleId: req.user.googleId,
          "drafts._id": mongoose.Types.ObjectId(req.body.id)
        },
        {
          $set: {
            "drafts.$.paper": newPaper,
            "drafts.$.review": draft.review
          }
        },
        { new: true } // return updated post
      );
      if (!user) {
        res.status(404).send("No item found");
      } else {
        res.send(JSON.stringify(user.drafts[user.drafts.length - 1]));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.delete("/api/drafts/:id", requireLogin, async (req, res) => {
    try {
      User.findOneAndUpdate(
        { googleId: req.user.googleId },
        {
          $pull: {
            drafts: { _id: new mongoose.Types.ObjectId(req.params.id) }
          }
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
