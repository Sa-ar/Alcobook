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
    const result = await Cocktail.find({}, null, { sort: { createdAt: -1 } });

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
    const search = req.body.search;
    const searchQuery = {};

    if (search.title) {
      searchQuery.title = search.title;
    }
    if (search.author) {
      searchQuery.author = search.author;
    }
    if (search.body) {
      searchQuery.body = { $regex: search.body, $options: 'i' };
    }
    if (search.ingredient) {
      searchQuery.ingredients = { $regex: search.ingredient, $options: 'i' };
    }

    const result = await Cocktail.find(searchQuery, null, {
      sort: { createdAt: -1 },
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function leadingAuthor(req, res) {
  try {
    const result = await Cocktail.mapReduce({
      map: function () {
        emit(this.author, this.likes);
      },
      reduce: function (author, likes) {
        return Array.sum(likes.length);
      },
      out: { reduce: 'leadingAuthor' },
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).end(err);
  }
}

async function cocktailsPerDay(req, res) {
  try {
    const result = await Cocktail.aggregate([
      {
        $project: {
          yearMonthDay: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          time: {
            $dateToString: { format: '%H:%M:%S:%L', date: '$createdAt' },
          },
        },
      },
      { $group: { _id: '$yearMonthDay', cocktails: { $push: '$_id' } } },
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
  addMany,
  updateOne,
  toggleLike,
  deleteOne,
  search,
  leadingAuthor,
  cocktailsPerDay,
};
