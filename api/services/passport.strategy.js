const LocalStrategy = require('passport-local');
const Users = require('../models/User');

const Strategy = new LocalStrategy(
  {
    usernameField: 'user[username]',
    passwordField: 'user[password]',
  },
  (username, password, done) => {
    Users.findOne({ username })
      .then((user) => {
        if (!user || !user.validatePassword(password)) {
          return done(null, false, {
            errors: { 'username or password': 'is invalid' },
          });
        }

        return done(null, user);
      })
      .catch(done);
  },
);

module.exports = Strategy;
