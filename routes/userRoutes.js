const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = app => {
  app.get("/api/auth", async (req, res) => {
    cognitoExpress.validate(idTokenFromClient, async function(err, response) {
      if (err) return res.status(401).send(err);
      const userExists = await User.exists({ unique_id: response.sub });

      if (userExists) {
        let user = await User.findOne({ unique_id: response.sub });
        res.send(JSON.stringify(user));
      } else {
        // make a new user
        let userData = {
          unique_id: response.sub,
          display_name: response.name,
          reading_list: [],
          reviews: []
        };
        let newUser = await new User(userData).save();
        res.send(JSON.stringify(newUser));
      }
    });
  });
};
