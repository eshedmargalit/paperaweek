const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = app => {
  app.put("/api/user", async (req, res) => {
    const filter = { googleId: req.user.googleId };
    const update = req.body;

    try {
      let user = await User.findOneAndUpdate(
        filter,
        update,
        { new: true } // return updated post
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
