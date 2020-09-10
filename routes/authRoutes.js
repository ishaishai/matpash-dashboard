const router = require('express').Router();
const authCtrl = require('../controllers/authController');

router.post('/login', authCtrl.login)
router.post('/register', authCtrl.registerUser);
router.get('/user', authCtrl.user);

module.exports = router;
