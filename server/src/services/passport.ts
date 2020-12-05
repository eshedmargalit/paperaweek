import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { getEnvironmentVariable } from '../config/keys';
import UserModel, { UserDocument } from '../models/User';

passport.serializeUser<UserDocument, string>((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id).then((user) => {
    done(null, user);
  });
});

const googleClientID = getEnvironmentVariable('googleClientID');
const googleClientSecret = getEnvironmentVariable('googleClientSecret');

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
