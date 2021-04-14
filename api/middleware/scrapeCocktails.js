const { getCocktails } = require('../../scrapper');

module.exports = async function scrapeCocktails(req, res, next) {
  req.cocktails = await getCocktails();

  next();
};
