const mongoose = require("mongoose");
const User = mongoose.model("users");

function filterUserData(user) {
  return {
    userDisplayName: user.displayName,
    reviews: user.reviews
  };
}

module.exports = app => {
  app.get("/api/profiles/:userId", async (req, res) => {
    const mongoId = req.params.userId;

    try {
      let user = await User.findOne({ _id: mongoId });

      if (!user) {
        res.status(404).send("No item found");
      } else {
        const filteredData = filterUserData(user);
        res.send(JSON.stringify(filteredData));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
