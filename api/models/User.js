const mongoose = require('mongoose');
const schemaTypes = require('../../../config/schemaTypes');
const { createValidateQueryParams } = require('../services/helper');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const modelSchema = new mongoose.Schema({
  username: schemaTypes.requiredUniqueString,
  password: schemaTypes.requiredString,
  role: schemaTypes.userRolesString,
  hash: schemaTypes.requiredString,
  salt: schemaTypes.requiredString,
  cocktails: schemaTypes.arrayOf('Cocktail'),
  comments: schemaTypes.arrayOf('Comment'),
  cocktailsLiked: schemaTypes.arrayOf('Cocktail'),
});

modelSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

modelSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');

  return this.hash === hash;
};

modelSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      username: this.username,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    process.env.JWT_SECRET,
  );
};

modelSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    username: this.username,
    role: this.role,
    token: this.generateJWT(),
  };
};

modelSchema.methods.isAdmin = function () {
  return this.role === 'Admin';
};

modelSchema.methods.validateQueryParams = createValidateQueryParams([
  'username',
]);

module.exports = mongoose.model('User', modelSchema);
