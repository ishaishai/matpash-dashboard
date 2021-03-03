const router = require('express').Router();
const authCtrl = require('../controllers/authController');
const requireToken = require('../middlewares/requireToken');
const checkTestUser = require('../middlewares/checkTestUser');

router.post('/login', authCtrl.login);
router.post('/register', requireToken, checkTestUser, authCtrl.registerUser);
router.get('/current_user', requireToken, authCtrl.currentUser);
router.get('/logout', authCtrl.logout);

module.exports = router;
