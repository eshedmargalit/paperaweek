const mongoose = require("mongoose");
const User = mongoose.model("users");
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  app.put("/api/points/:points", requireLogin, async (req, res) => {
    const points = req.params.points;

    try {
      let user = await User.findOneAndUpdate(
        { googleId: req.user.googleId },
        {
          $set: {
            points: points
          }
        },
        { new: true }
      );

      if (!user) {
        res.status(404).send("No item found");
      } else {
        res.send(JSON.stringify(user));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.put("/givePoints/dailyLogin", requireLogin, async (req, res) => {
    const points = req.params.points;

    try {
      let user = await User.findOneAndUpdate(
        { googleId: req.user.googleId },
        {
          $set: {
            points: points
          }
        },
        { new: true }
      );

      if (!user) {
        res.status(404).send("No item found");
      } else {
        res.send(JSON.stringify(user));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
