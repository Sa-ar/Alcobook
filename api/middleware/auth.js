const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }

  return null;
};

function admin(req, res, next) {
  const { user } = req.body;

  if (!user || !user.role || user.role !== 'Admin') {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  return next();
}

function adminOrCurrentUser(model, userField) {
  return function (req, res, next) {
    const {
      body: { user },
    } = req;
    const token = getTokenFromHeaders(req);

    if (
      !token ||
      !user ||
      (user.role !== 'Admin' &&
        model.findById(req.params.id)[userField] !== user.id)
    ) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    return next();
  };
}

function notLoggedIn(req, res, next) {
  const token = getTokenFromHeaders(req);

  if (!token) {
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized.' });
}

const auth = {
  required: jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    algorithms: ['sha1', 'RS256', 'HS256'],
  }),
  admin,
  optional: jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
    algorithms: ['RS256'],
  }),
  adminOrCurrentUser,
  notLoggedIn,
};

module.exports = auth;
