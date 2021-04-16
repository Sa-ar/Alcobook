const Cocktail = require('../models/Cocktail');
const Comment = require('../models/Comment');

async function getOne(req, res) {
  try {
    const result = await Cocktail.findById(req.params.id).populate('comments');

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function getAll(req, res) {
  try {
    const result = await Cocktail.find({});

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function addOne(req, res) {
  try {
    const newCocktail = {
      title: req.body.title,
      image: req.body.image,
      body: req.body.body,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      author: req.body.user.username,
      authorRef: req.body.user._id,
      likes: [],
      comments: [],
    };
    const result = await new Cocktail(newCocktail).save();

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function addMany(req, res) {
  try {
    const result = await Cocktail.insertMany(req.cocktails);

    res.status(201).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(400).end(err);
  }
}

async function updateOne(req, res) {
  try {
    const result = await Cocktail.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.change },
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
    const cocktail = await Cocktail.findById(req.params.id);

    if (cocktail.likes.includes(req.body.user._id)) {
      cocktail.likes.pull(req.body.user._id);
    } else {
      cocktail.likes.push(req.body.user._id);
    }
    cocktail.save();

    res.status(200).json(cocktail);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function deleteOne(req, res) {
  try {
    await Cocktail.findById(req.params.id, function (err, cocktail) {
      if (err) throw new Error(err);

      cocktail.remove();
    });

    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function search(req, res) {
  try {
    const result = await Cocktail.find(req.body.search);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
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
    res.status(400).end(err);
  }
}

async function cocktailsPerDay(req, res) {
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
    res.status(400).end(err);
  }
}

module.exports = {
  getOne,
  getAll,
  addOne,
  addMany,
  updateOne,
  toggleLike,
  deleteOne,
  search,
  leadingAuthor,
  cocktailsPerDay,
};
