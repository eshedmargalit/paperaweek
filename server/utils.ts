import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { cookieKey } from './config/keys';

const createApp = (port = 5000) => {
  const app = express();

  if (!cookieKey) throw Error('Cookie key must be present');

  app.use(bodyParser.json());
  app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [cookieKey],
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  require('./services/passport');
  require('./routes/authRoutes')(app);
  require('./routes/paperRoutes')(app);
  require('./routes/readingListRoutes')(app);
  require('./routes/userRoutes')(app);
  require('./routes/draftRoutes')(app);
  require('./routes/searchBarRoutes')(app);
  require('./routes/loginRoutes')(app);
  require('./routes/profileRoutes')(app);

  if (process.env.NODE_ENV === 'production') {
    // Express knows how to serve production assets (like main.js)
    app.use(express.static('../client/build'));
    // Express will serve up the HTML file if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
    });
  }

  const PORT = process.env.PORT || port;
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });

  return app;
};

export default createApp;
