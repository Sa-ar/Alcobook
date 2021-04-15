const mongoose = require('mongoose');
const schemaTypes = require('../../config/schemaTypes');
const Comment = require('./Comment');

const modelSchema = new mongoose.Schema(
  {
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
  },
  {
    collection: 'Cocktails',
  },
);

modelSchema.methods.numOfLikes = function () {
  return this.likes.length;
};

modelSchema.methods.numOfComments = function () {
  return this.comments.length;
};

modelSchema.post('remove', async (doc) => {
  await Comment.deleteMany({ _id: { $in: doc.comments } });
});

module.exports = mongoose.model('Cocktail', modelSchema);
