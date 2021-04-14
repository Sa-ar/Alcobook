const Comment = require('../models/Comment');
const Cocktail = require('../models/Cocktail');

async function getOne(req, res) {
  try {
    const result = await Comment.findById(req.body.id);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function getAll(req, res) {
  try {
    const result = await Comment.find({});

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function addOne(req, res) {
  try {
    const newComment = {
      body: req.body.body,
      author: req.body.user.username,
      authorRef: req.body.user._id,
      likes: [],
    };
    const result = await new Comment(newComment).save();
    await Cocktail.findByIdAndUpdate(
      req.body.id,
      { $push: { comments: result._id } },
      { safe: true, upsert: true },
    );

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function updateOne(req, res) {
  try {
    const result = await Comment.findByIdAndUpdate(
      req.body.id,
      { $set: req.body.change },
      { new: true },
    );

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function deleteOne(req, res) {
  try {
    await Comment.findByIdAndDelete(req.body.id);

    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function search(req, res) {
  try {
    const result = await Comment.find(req.body.search);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

module.exports = {
  getOne,
  getAll,
  addOne,
  updateOne,
  deleteOne,
  search,
};
