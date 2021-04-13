const Comment = require('../models/Comment');

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
    Comment.validateQueryParams(req.body);
    const result = new model(req.body).save();

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
