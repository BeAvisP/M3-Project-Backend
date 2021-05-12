const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
//const User = require('');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {
    User.findById(id)
      .then((user) => cb(null, user.id))
      .catch((error) => cb(error));
  });

  passport.use(
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      (req, email, password, next) => {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return next(null, false, {
                message: 'User or password incorrect',
              });
            }
            if (bcrypt.compareSync(password, user.password)) {
              return next(null, user);
            } else {
              return next(null, false, {
                message: 'User or password incorrect',
              });
            }
          })
          .catch((error) => next(error));
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
      },
      (accesToken, refreshToken, profile, cb) => {
        User.findOne({ email: porfile._json.email })
          .then((user) => {
            if (user) {
              cb(null, user);
              return;
            }
            console.log(profile);
            User.create({
              email: profile._json.email,
              name: profile.displayName,
              profile_pic: profile._json.picture,
            })
              .then((newUSer) => {
                cb(null, newUser);
              })
              .catch((error) => cb(error));
          })
          .catch((error) => cb(error));
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
