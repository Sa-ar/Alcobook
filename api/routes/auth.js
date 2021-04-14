const router = require('express').Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

router.route('/login').post(auth.notLoggedIn, authController.login);

router.route('/logout').delete(auth.required, authController.logout);

router.route('/register').post(auth.notLoggedIn, userController.addOne);

module.exports = router;
