const CognitoExpress = require("cognito-express");
const cognitoExpress = new CognitoExpress({
  region: "us-west-2",
  cognitoUserPoolId: "us-west-2_qQAUz1CtO",
  tokenUse: "id", //Possible Values: access | id
  tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
});

module.exports = app => {
  app.get("/api/auth", (req, res) => {
    let idTokenFromClient = req.headers.idtoken;
    if (!idTokenFromClient) return res.status(401).send("No ID Token received");

    cognitoExpress.validate(idTokenFromClient, function(err, response) {
      if (err) return res.status(401).send(err);
      res.send(JSON.stringify(response));
    });
  });
};
