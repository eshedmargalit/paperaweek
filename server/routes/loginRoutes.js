const mongoose = require("mongoose");
const User = mongoose.model("users");
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  app.get("/api/lastLogin", requireLogin, async (req, res) => {
    let user = await User.findOne({ googleId: req.user.googleId });
    let d = Date.now();
    user.lastLogin = d;
    user.save();
    res.send(JSON.stringify(user));
  });
};
