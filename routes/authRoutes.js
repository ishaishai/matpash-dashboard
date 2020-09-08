const router = require('express').Router();
const authCtrl = require('../controllers/authController');

router.post('/login', authCtrl.login);

module.exports = router;
