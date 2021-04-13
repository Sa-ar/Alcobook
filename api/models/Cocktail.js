const mongoose = require('mongoose');
const schemaTypes = require('../../../config/schemaTypes.constants');
const { createValidateQueryParams } = require('../../../services/helper');

const modelSchema = new mongoose.Schema({
  title: schemaTypes.requiredString,
  image: schemaTypes.requiredString,
  body: schemaTypes.requiredString,
  ingredients: schemaTypes.arrayOfStrings,
  steps: schemaTypes.arrayOfStrings,
  author: schemaTypes.requiredString,
  authorRef: schemaTypes.refTo('User'),
  createdAt: schemaTypes.timestamp,
  likes: schemaTypes.arrayOf('User'),
  comments: schemaTypes.arrayOf('Comment'),
});

modelSchema.methods.numOfLikes = function () {
  return this.likes.length;
};

modelSchema.methods.numOfComments = function () {
  return this.comments.length;
};

modelSchema.methods.validateQueryParams = createValidateQueryParams([
  'title',
  'body',
  'ingredients',
  'author',
]);

module.exports = mongoose.model('Cocktail', modelSchema);
