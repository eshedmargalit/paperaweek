const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./models/Paper");

const app = express();
const port = 5000;

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true });
app.use(bodyParser.json());

require("./routes/paperRoutes")(app);
require("./routes/userRoutes")(app);

const PORT = process.env.PORT || port;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
