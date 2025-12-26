import { Application } from 'express';
import passport from 'passport';

module.exports = (app: Application) => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'), (_, res) => {
    const clientUrl = process.env.NODE_ENV === 'production' ? '/dashboard' : 'http://localhost:3000/dashboard';
    res.redirect(clientUrl);
  });

  // Logout is automatically attached to the req object by logout
  // Kills the cookie!
  app.get('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.redirect('/');
    });
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
