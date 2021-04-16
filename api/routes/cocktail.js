const router = require('express').Router();
const auth = require('../middleware/auth');
const cocktailController = require('../controllers/cocktail');
const editorPermission = auth.adminOrCurrentUser(
  require('../models/Cocktail', 'authorRef'),
);
const scrapeCocktails = require('../middleware/scrapeCocktails');

router
  .route('/')
  .get(cocktailController.getAll)
  .post(auth.required, cocktailController.addOne);

router
  .route('/:id')
  .get(cocktailController.getOne)
  .post(auth.required, cocktailController.toggleLike)
  .patch(editorPermission, cocktailController.updateOne)
  .delete(editorPermission, cocktailController.deleteOne);

router.route('/most-liked-author').get(cocktailController.leadingAuthor);

router.route('/cocktails-per-day').get(cocktailController.cocktailsPerDay);

router
  .route('/scrape')
  .post(auth.admin, scrapeCocktails, cocktailController.addMany);

module.exports = router;
