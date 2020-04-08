const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("./config/keys");

const createApp = (port = 5000) => {
  const app = express();

  app.use(bodyParser.json());
  app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [keys.cookieKey]
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  require("./services/passport");
  require("./routes/authRoutes")(app);
  require("./routes/paperRoutes")(app);
  require("./routes/readingListRoutes")(app);
  require("./routes/draftRoutes")(app);
  require("./routes/pointsRoutes")(app);
  require("./routes/searchBarRoutes")(app);
  require("./routes/loginRoutes")(app);

  if (process.env.NODE_ENV === "production") {
    // Express knows how to serve production assets (like main.js)
    app.use(express.static("client/build"));
    // Express will serve up the HTML file if it doesn't recognize the route
    const path = require("path");
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
  }

  const PORT = process.env.PORT || port;
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });

  return app;
};

exports.createApp = createApp;
