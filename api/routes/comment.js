const router = require('express').Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/comment');
const editorPermission = auth.adminOrCurrentUser(
  require('../models/Comment', 'authorRef'),
);

router
  .route('/')
  .get(commentController.getAll)
  .post(auth.required, commentController.addOne);

router
  .route('/:id')
  .get(commentController.getOne)
  .post(auth.required, commentController.toggleLike)
  .patch(editorPermission, commentController.updateOne)
  .delete(editorPermission, commentController.deleteOne);

router.route('/search').get(commentController.search);

module.exports = router;
