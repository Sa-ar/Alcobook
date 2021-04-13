const Cocktail = require('../models/Cocktail');

async function getOne(req, res) {
  try {
    const result = await Cocktail.findById(req.body.id);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function getAll(req, res) {
  try {
    const result = await Cocktail.find({});

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function addOne(req, res) {
  try {
    Cocktail.validateQueryParams(req.body);
    const result = new model(req.body).save();

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function updateOne(req, res) {
  try {
    const result = await Cocktail.findByIdAndUpdate(
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
    await Cocktail.findByIdAndDelete(req.body.id);

    res.status(200);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function search(req, res) {
  try {
    const result = await Cocktail.find(req.body.search);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function leadingAuthor(req, res) {
  try {
    const result = await Cocktail.mapReduce(
      function () {
        emit(this.author, this.likes);
      },
      function (author, likes) {
        return Array.sum(likes.length);
      },
      { out: 'leadingAuthor' },
    );

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
}

async function cocktailPerDay(req, res) {
  try {
    const result = await Cocktail.group({
      keyf: function (doc) {
        var date = new Date(doc.date);
        var dateKey =
          date.getMonth() +
          1 +
          '/' +
          date.getDate() +
          '/' +
          date.getFullYear() +
          '';
        return { day: dateKey };
      },
      initial: { count: 0 },
      reduce: function (obj, prev) {
        prev.count++;
      },
    });

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
  leadingAuthor,
  cocktailPerDay,
};
