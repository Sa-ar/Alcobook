const router = require('express').Router();
const auth = require('../middleware/auth');
const cocktailController = require('../controllers/cocktail');
const editorPermission = auth.adminOrCurrentUser(
  require('../models/Cocktail', 'authorRef'),
);

router
  .route('/')
  .get(cocktailController.getAll)
  .post(auth.required, cocktailController.addOne);

router
  .route('/:id')
  .get(cocktailController.getOne)
  .patch(editorPermission, cocktailController.updateOne)
  .delete(editorPermission, cocktailController.deleteOne);

router.route('/most-liked-author').get(cocktailController.leadingAuthor);

router.route('/cocktails-per-day').get(cocktailController.cocktailsPerDay);

module.exports = router;
