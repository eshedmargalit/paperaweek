const mongoose = require("mongoose");
const User = mongoose.model("users");

function filterUserData(user) {
  return {
    userDisplayName: user.displayName,
    reviews: user.reviews
  };
}

module.exports = app => {
  app.get("/api/profiles/:googleId", async (req, res) => {
    const googleId = req.params.googleId;

    try {
      let user = await User.findOne({ googleId: googleId });

      if (!user) {
        res.status(404).send("No item found");
      } else if (!user.publicProfile) {
        res.status(404).send("Profile is private");
      } else {
        const filteredData = filterUserData(user);
        res.send(JSON.stringify(filteredData));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
