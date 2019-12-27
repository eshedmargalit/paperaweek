const mongoose = require("mongoose");
const User = mongoose.model("users");
const Paper = mongoose.model("papers");

module.exports = app => {
  app.get("/api/drafts", async (req, res) => {
    let user = await User.findById(req.headers.userid);
    res.send(JSON.stringify(user.drafts));
  });

  app.post("/api/drafts", async (req, res) => {
    let newPaper = new Paper(req.body.paper);
    let newReview = {
      paper: newPaper,
      review: req.body.review,
      _id: new mongoose.Types.ObjectId()
    };
    let user = await User.findOne({ _id: req.headers.userid });
    user.drafts.push(newReview);
    user.save();
    res.send(JSON.stringify(newReview));
  });

  app.put("/api/drafts", async (req, res) => {
    try {
      let newPaper = new Paper(req.body.paper);
      let user = await User.findOneAndUpdate(
        {
          _id: req.headers.userid,
          "drafts._id": mongoose.Types.ObjectId(req.headers.id)
        },
        {
          $set: {
            "drafts.$.paper": newPaper,
            "drafts.$.review": req.body.review
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

  app.delete("/api/drafts", async (req, res) => {
    try {
      User.findOneAndUpdate(
        { _id: req.headers.userid },
        {
          $pull: {
            drafts: { _id: new mongoose.Types.ObjectId(req.body._id) }
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
