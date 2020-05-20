require("dotenv").config();

require("./models/Paper");
require("./models/User");
require("./models/Review");

const createApp = require("./utils").createApp;
const mongoose = require("mongoose");
const keys = require("./config/keys");

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// from https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

createApp(5000);
