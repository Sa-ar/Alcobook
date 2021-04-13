const passport = require('passport');
const strategy = require('../api/services/passport.strategy');
const Users = require('../api/models/User');

module.exports = function initializePassport() {
  passport.use(strategy);
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) => done(null, Users.findById(id)));
};
