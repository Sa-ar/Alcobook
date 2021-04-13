const mongoose = require('mongoose');
const schemaTypes = require('../../../config/schemaTypes.constants');
const { createValidateQueryParams } = require('../../../services/helper');

const modelSchema = new mongoose.Schema({
  body: schemaTypes.requiredString,
  author: schemaTypes.requiredString,
  authorRef: schemaTypes.refTo('User'),
  createdAt: schemaTypes.timestamp,
  likes: schemaTypes.arrayOf('User'),
});

modelSchema.methods.numOfLikes = function () {
  return this.likes.length;
};

modelSchema.methods.validateQueryParams = createValidateQueryParams([
  'body',
  'author',
]);

module.exports = mongoose.model('Comment', modelSchema);
