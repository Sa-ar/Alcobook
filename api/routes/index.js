const router = require('express').Router();
const authRoutes = require('.auth');
const cocktailRoutes = require('./cocktail');
const commentRoutes = require('./comment');
const userRoutes = require('./user');

router.use('/', authRoutes);
router.use('/cocktail', cocktailRoutes);
router.use('/comment', commentRoutes);
router.use('/user', userRoutes);

module.exports = router;
