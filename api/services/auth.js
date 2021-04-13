const passport = require('passport');

function authenticate(req, res, next) {
  const authenticateHandler = (err, passportUser, info) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return res.status(400).json({ info });
  };

  return passport.authenticate(
    'local',
    { session: false },
    authenticateHandler,
  );
}

function userValidation(user, res) {
  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }
}

module.exports = {
  authenticate,
  userValidation,
};
