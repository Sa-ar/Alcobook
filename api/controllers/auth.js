const passport = require('passport');

module.exports = {
  login(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ error: 'No user.' });
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        user.token = user.generateJWT();

        return res.status(200).json({
          user: user.toAuthJSON(),
        });
      });
    })(req, res, next);
  },
  logout(req, res) {
    req.logOut();

    return res.status(200);
  },
};
