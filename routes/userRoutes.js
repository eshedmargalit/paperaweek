const mongoose = require("mongoose");
const User = mongoose.model("users");
const CognitoExpress = require("cognito-express");
const cognitoExpress = new CognitoExpress({
  region: "us-west-2",
  cognitoUserPoolId: "us-west-2_qQAUz1CtO",
  tokenUse: "id", //Possible Values: access | id
  tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
});

module.exports = app => {
  app.get("/api/auth", async (req, res) => {
    let idTokenFromClient = req.headers.idtoken;
    if (!idTokenFromClient) return res.status(401).send("No ID Token received");

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
