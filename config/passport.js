const { compareSync } = require('bcrypt');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { UserModel, pg } = require('./database');

passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const user = await UserModel.findOne({ username: username });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (!compareSync(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

//Persists user data inside session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//Fetches session details using session id
passport.deserializeUser(async function (id, done) {
  try {
      const user = await UserModel.findById(id);
      done(null, user);
  } catch (err) {
      done(err, null);
  }
});
