const mongoose = require('mongoose');

// Strings
module.exports.requiredString = {
  type: String,
  required: true,
  trim: true,
};

module.exports.requiredUniqueString = {
  type: String,
  required: true,
  trim: true,
  unique: true,
  dropDups: true,
};

module.exports.nonRequiredString = {
  type: String,
  trim: true,
};

module.exports.userRolesString = {
  type: String,
  required: true,
  trim: true,
  enum: ['Admin', 'User'],
};

// Numbers
module.exports.requiredNumber = { type: Number, required: true };

module.exports.nonRequiredNumber = { type: Number };

// Booleans
module.exports.requiredBoolean = { type: Boolean, required: true };

module.exports.nonRequiredBoolean = { type: Boolean };

// Dates
module.exports.requiredDate = {
  type: Date,
  required: true,
};

module.exports.timestamp = {
  type: Date,
  default: Date.now,
};

// Ref
module.exports.refTo = (ref) => ({
  type: mongoose.Schema.ObjectId,
  ref,
});

// Arrays
module.exports.arrayOf = (ref) => [module.exports.refTo(ref)];

module.exports.arrayOfStrings = [module.exports.requiredString];
