import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { getEnvironmentVariable } from '../config/keys';
import UserModel, { UserDocument } from '../models/User';

passport.serializeUser((user: any, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser((id: string, done) => {
  UserModel.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

const googleClientID = getEnvironmentVariable('GOOGLE_CLIENT_ID');
const googleClientSecret = getEnvironmentVariable('GOOGLE_CLIENT_SECRET');

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, { id, displayName }, done) => {
      const existingUser = await UserModel.findOne({ googleId: id });

      if (existingUser) {
        // We already have this user, nice!
        return done(undefined, existingUser);
      }

      // make a new user
      const userData = {
        googleId: id,
        displayName,
        reading_list: [],
        reviews: [],
      };
      const newUser = await new UserModel(userData).save();
      return done(undefined, newUser);
    }
  )
);
