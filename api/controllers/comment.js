const Comment = require('../models/Comment');
const Cocktail = require('../models/Cocktail');

async function getOne(req, res) {
  try {
    const result = await Comment.findById(req.params.id);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function getAll(req, res) {
  try {
    const result = await Comment.find({}, null, { sort: { createdAt: -1 } });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
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
    res.status(400).end(err);
  }
}

async function updateOne(req, res) {
  try {
    const result = await Comment.findByIdAndUpdate(
      req.params.id,
      { $set: { body: req.body.body } },
      { new: true },
    );

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function toggleLike(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment.likes.includes(req.body.user._id)) {
      comment.likes.pull(req.body.user._id);
    } else {
      comment.likes.push(req.body.user._id);
    }
    comment.save();

    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function deleteOne(req, res) {
  try {
    await Comment.findByIdAndRemove(req.params.id);
    await Cocktail.updateOne(
      { comments: { $in: [req.params.id] } },
      { $pull: { comments: req.params.id } },
    );

    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function search(req, res) {
  try {
    const result = await Comment.aggregate([
      {
        $match: {
          body: { $regex: req.body.search.body, $options: 'i' },
        },
      },
      { $unwind: '$body' },
      {
        $match: {
          body: { $regex: req.body.search.body, $options: 'i' },
        },
      },
      {
        $group: {
          _id: '$_id',
          body: { $first: '$body' },
          author: { $first: '$author' },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

module.exports = {
  getOne,
  getAll,
  addOne,
  updateOne,
  toggleLike,
  deleteOne,
  search,
};
