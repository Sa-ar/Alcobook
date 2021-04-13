const Comment = require('../models/Comment');
const Cocktail = require('../models/Cocktail');
const User = require('../models/User');
const { userValidation } = require('../services/auth');

async function getOne(req, res) {
  try {
    const result = await User.findById(req.body.id);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function getAll(req, res) {
  try {
    const result = await User.find({});

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function addOne(user) {
  userValidation(user, res);

  const newUser = new User(user);
  newUser.setPassword(user.password);

  return newUser.save().then(() => res.json({ user: finalUser.toAuthJSON() }));
}

async function updateOne(req, res) {
  try {
    const result = await User.findByIdAndUpdate(
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
    await User.findByIdAndDelete(req.body.id);

    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function search(req, res) {
  try {
    const result = await User.find(req.body.search);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function getComments(userId) {
  const items = await Comment.find({ user: userId });

  return items;
}

async function getCocktails(userId) {
  const items = await Cocktail.find({ user: userId });

  return items;
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
