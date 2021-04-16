const Comment = require('../models/Comment');
const Cocktail = require('../models/Cocktail');
const User = require('../models/User');

async function getOne(req, res) {
  try {
    const result = await User.findById(req.body.id);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function getAll(req, res) {
  try {
    const result = await User.find({});

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function addOne(req, res) {
  const { username, password } = req.body;

  try {
    const newUser = new User({
      username,
      role: 'User',
    });
    newUser.setPassword(password);

    await newUser.save();

    return res.status(201).json({ username: newUser.username });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Couldn't create user.", message: error.message });
  }
}

async function updateOne(req, res) {
  try {
    let result;

    if (req.body.password) {
      result = await User.findById(req.params.id);
      result.setPassword(req.body.password);
    }
    if (req.body.username) {
      result = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body.username },
        { new: true },
      );
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function deleteOne(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function search(req, res) {
  try {
    const searchQuery = {
      username: { $regex: req.body.search.username, $options: 'i' },
    };
    const result = await User.find(searchQuery);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function getComments(req, res) {
  try {
    const comments = await Comment.find({ authorRef: req.params.id });

    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function getCocktails(req, res) {
  try {
    const cocktails = await Cocktail.find({ authorRef: req.params.id });

    res.status(200).json(cocktails);
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
  deleteOne,
  search,
  getComments,
  getCocktails,
};
