const router = require('express').Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/user');

router.route('/login').post(authController.login);

router.route('/logout').delete(authController.logout);

router.route('/register').post(userController.addOne);

module.exports = router;
