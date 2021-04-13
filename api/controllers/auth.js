const authService = require('../services/auth');

module.exports = {
  login(req, res, next) {
    const {
      body: { user },
    } = req;

    authService.userValidation(user, res);

    return authService.authenticate(req, res, next);
  },
  logout(req, res) {
    req.logOut();

    return res.status(200);
  },
};
