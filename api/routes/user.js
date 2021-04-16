const router = require('express').Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/user');

router.route('/search').post(userController.search);

router.route('/:id/comments').get(userController.getComments);

router.route('/:id/cocktails').get(userController.getCocktails);

router
  .route('/:id')
  .get(userController.getOne)
  .patch(
    auth.adminOrCurrentUser(require('../models/User'), '_id'),
    userController.updateOne,
  )
  .delete(auth.admin, userController.deleteOne);

router.route('/').get(userController.getAll);

module.exports = router;
