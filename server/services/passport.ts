import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import mongoose from 'mongoose';
import { googleClientID, googleClientSecret } from '../config/keys';

const User = mongoose.model('users');

// TODO AM: Define user elsewhere
passport.serializeUser<{ id: string; googleId: string }, string>((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// If we don't have required keys, throw up
if (!googleClientID || !googleClientSecret) throw Error('Google configuration keys are missing.');

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, { id, displayName }, done) => {
      const existingUser = await User.findOne({ googleId: id });

      if (existingUser) {
        // We already have this user, nice!
        return done(undefined, existingUser);
      }

      // make a new user
      const userData = {
        googleId: id,
        displayName: displayName,
        reading_list: [],
        reviews: [],
      };
      const newUser = await new User(userData).save();
      done(undefined, newUser);
    }
  )
);
