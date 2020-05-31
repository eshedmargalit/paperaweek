const mongoose = require("mongoose");
const User = mongoose.model("users");

function filterUserData(user) {
  if (user.publicProfile) {
    return {
      userDisplayName: user.displayName,
      reviews: user.reviews
    };
  } else {
    return {
      userDisplayName: null,
      reviews: null
    };
  }
}

module.exports = app => {
  app.get("/api/profiles/:googleId", async (req, res) => {
    const googleId = req.params.googleId;
    const currentUserGoogleId = req.user ? req.user.googleId : null;
    const isOwnPage = googleId === currentUserGoogleId;

    try {
      let user = await User.findOne({ googleId: googleId });

      if (!user) {
        res.status(404).send("No item found");
      } else {
        let filteredData = filterUserData(user);
        filteredData.isOwnPage = isOwnPage;
        res.send(JSON.stringify(filteredData));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
};
