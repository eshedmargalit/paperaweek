const mongoose = require("mongoose");
const User = mongoose.model("users");
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  app.put("/api/readingList", requireLogin, async (req, res) => {
    let user = await User.findOne({ googleId: req.user.googleId });
    user.readingList = req.body;
    user.save();
    res.send(JSON.stringify(user.readingList));
  });
};
