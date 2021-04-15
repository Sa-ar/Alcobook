const mongoose = require('mongoose');
const schemaTypes = require('../../config/schemaTypes');
const Cocktail = require('./Cocktail');

const modelSchema = new mongoose.Schema(
  {
    body: schemaTypes.requiredString,
    author: schemaTypes.requiredString,
    authorRef: schemaTypes.refTo('User'),
    createdAt: schemaTypes.timestamp,
    likes: schemaTypes.arrayOf('User'),
  },
  {
    collection: 'Comments',
  },
);

modelSchema.methods.numOfLikes = function () {
  return this.likes.length;
};

module.exports = mongoose.model('Comment', modelSchema);
