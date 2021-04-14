const rp = require('request-promise');
const fs = require('fs');
const $ = require('cheerio');
const mongoose = require('mongoose');

const url = 'https://www.liquor.com/cocktail-type-4779426';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports.getCocktails = async function getCocktails() {
  const html = await rp(url);
  const cocktailsLinks = await getCocktailsLinks(html);
  const cocktails = await getRawCocktails(cocktailsLinks);

  return cocktails.filter((cocktail) => cocktail.ingredients.length);
};

async function getRawCocktails(links) {
  const cocktails = [];

  for (let link of links) {
    try {
      const linkHTML = await rp(link);
      const cocktail = extractCocktail(linkHTML);

      cocktails.push(cocktail);
      //await delay(50);
    } catch (error) {
      console.error(error);
    }
  }

  return cocktails;
}

async function getCocktailsLinks(html) {
  const cocktailsTypeLinks = Array.from(
    $('.truncated-list__item-link', html),
  ).map((a) => a.attribs.href);
  const cocktailsLinks = [];

  for (let type of cocktailsTypeLinks) {
    const newLinks = await rp(type).then(function (html) {
      return Array.from($('.card-list__item > a.card', html)).map(
        (a) => a.attribs.href,
      );
    });

    cocktailsLinks.push(...newLinks);
  }

  return cocktailsLinks;
}

function extractCocktail(html) {
  const title = $('.heading__title', html)[0].children[0].data;
  const image = $('img.primary-image', html)[0].attribs.src;
  const body = Array.from($('.article-intro p', html))
    .map((p) => p.children[0].data)
    .join('');

  const ingredients = $('.section--ingredients li, li.ingredient', html)
    .text()
    .split('\n')
    .filter((ingredient) => ingredient);

  const steps = Array.from($('ol li p.mntl-sc-block-html', html))
    .map((step) => step.children[0].data.split('\n')[1])
    .filter((ingredient) => !!ingredient);

  return {
    title,
    image,
    body,
    ingredients,
    steps,
    author: 'System',
    authorRef: mongoose.Types.ObjectId('6076c3e4d145df5910a70ac8'),
    createdAt: new Date(),
    likes: [],
    comments: [],
  };
}

module.exports.saveCocktailsToFile = async () => {
  const json = JSON.stringify(await getCocktails());

  fs.writeFile('./cocktailsDB.json', json, 'utf8', (err) => {
    if (err) throw err;
    fs.readFile('./cocktailsDB.json', 'utf-8', function (err) {
      if (err) throw err;
      console.log('Success!');
    });
  });
};
