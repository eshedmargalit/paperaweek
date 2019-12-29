const express = require("express");
const bodyParser = require("body-parser");

const createApp = (port = 5000) => {
  const app = express();

  app.use(bodyParser.json());

  require("./routes/paperRoutes")(app);
  require("./routes/readingListRoutes")(app);
  require("./routes/userRoutes")(app);
  require("./routes/draftRoutes")(app);

  const PORT = process.env.PORT || port;
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });

  return app;
};

exports.createApp = createApp;
