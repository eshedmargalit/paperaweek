const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = app => {
  app.put("/api/readingList", async (req, res) => {
    let user = await User.findOne({ googleId: req.user.googleId });
    user.readingList = req.body;
    user.save();
    res.send(JSON.stringify(user.readingList));
  });
};
