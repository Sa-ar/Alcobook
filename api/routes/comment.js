const router = require('express').Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/comment');
const editorPermission = auth.adminOrCurrentUser(
  require('../models/Comment', 'authorRef'),
);

router.route('/search').post(commentController.search);

router
  .route('/:id')
  .get(commentController.getOne)
  .post(auth.required, commentController.toggleLike)
  .patch(editorPermission, commentController.updateOne)
  .delete(editorPermission, commentController.deleteOne);

router
  .route('/')
  .get(commentController.getAll)
  .post(auth.required, commentController.addOne);

module.exports = router;
