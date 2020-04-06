const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = app => {
  app.get("/api/papers", async (req, res) => {
    let user = await User.findById(req.headers.userid);
    res.send(JSON.stringify(user.points));
  });

  app.put("/api/points/:points", async (req, res) => {
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
