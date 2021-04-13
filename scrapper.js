const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.liquor.com/cocktail-type-4779426';
const cocktails = [];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fs = require('fs');

rp(url)
  .then(async function (html) {
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

    for (let link of cocktailsLinks) {
      await rp(link)
        .then(function (html) {
          const title = $('.heading__title', html)[0].children[0].data;
          const image = $('img.primary-image', html)[0].attribs.src;
          const body = Array.from($('.article-intro p', html))
            .map((p) => p.children[0].data)
            .join('');

          const ingredients = $('.section--ingredients li, li.ingredient', html)
            .text()
            .split('\n')
            .filter((ingredient) => ingredient);

          const steps = Array.from($('ol li p.mntl-sc-block-html', html)).map(
            (step) => step.children[0].data.split('\n')[1],
          );

          const cocktail = {
            title,
            image,
            body,
            ingredients,
            steps,
            author: 'System',
            authorRef: '',
            createdAt: new Date(),
            likes: [],
            comments: [],
          };

          cocktails.push(cocktail);
        })
        .catch(console.error);
      await delay(50);
    }
  })
  .then(() => cocktails.filter((cocktail) => cocktail.ingredients.length))
  .then((cocktails) => JSON.stringify(cocktails))
  .then((json) => {
    fs.writeFile('./cocktailsDB.json', json, 'utf8', (err) => {
      if (err) throw err;
      fs.readFile('./cocktailsDB.json', 'utf-8', function (err) {
        if (err) throw err;
        console.log('Success!');
      });
    });
  })
  .catch(console.error);
