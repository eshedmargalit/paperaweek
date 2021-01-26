/* eslint-disable global-require */
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { getEnvironmentVariable } from './config/keys';

const createApp = (): Application => {
  const app = express();

  app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [getEnvironmentVariable('COOKIE_KEY')],
    })
  );

  app.use(bodyParser.json());

  app.use(passport.initialize());
  app.use(passport.session());

  require('./services/passport');
  require('./routes/authRoutes')(app);
  require('./routes/reviewRoutes')(app);
  require('./routes/readingListRoutes')(app);
  require('./routes/userRoutes')(app);
  require('./routes/draftRoutes')(app);
  require('./routes/searchBarRoutes')(app);
  require('./routes/profileRoutes')(app);
  require('./routes/healthRoutes')(app);

  if (process.env.NODE_ENV === 'production') {
    // Express knows how to serve production assets (like main.js)
    app.use(express.static('../../client/build'));
    // Express will serve up the HTML file if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html'));
    });
  }

  return app;
};

export default createApp;
