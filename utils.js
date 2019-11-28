const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./models/Paper");
require("./models/User");
require("./models/Review");

const createApp = (port = 5000) => {
  const app = express();

  mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true });

  // from https://mongoosejs.com/docs/deprecations.html#-findandmodify-
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  mongoose.set("useUnifiedTopology", true);

  app.use(bodyParser.json());

  require("./routes/paperRoutes")(app);
  require("./routes/readingListRoutes")(app);
  require("./routes/userRoutes")(app);

  const PORT = process.env.PORT || port;
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });

  return app;
};

exports.createApp = createApp;
