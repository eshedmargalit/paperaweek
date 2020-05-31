const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, { id, displayName }, done) => {
      const existingUser = await User.findOne({ googleId: id });

      if (existingUser) {
        //We already have this user, nice!
        return done(null, existingUser);
      }

      // make a new user
      const userData = {
        googleId: id,
        displayName: displayName,
        reading_list: [],
        reviews: []
      };
      const newUser = await new User(userData).save();
      done(null, newUser);
    }
  )
);
