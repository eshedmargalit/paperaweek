const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("./models/Paper");

const app = express();
const port = 5000;

mongoose.connect(
  process.env.REACT_APP_DB_CONNECTION_STRING,
  { useNewUrlParser: true}
);
app.use(bodyParser.json());

require("./routes/paperRoutes")(app);

const PORT = process.env.PORT || port;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
