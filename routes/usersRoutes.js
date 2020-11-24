const router = require('express').Router();
const usersCtrl = require('../controllers/usersController');

router.get('/', usersCtrl.getUsers);

router.get('/getall', usersCtrl.getall);
router.get('/userinfo/:username', usersCtrl.userinfo);
router.get('/page/:page', usersCtrl.page);
router.get('/search/:page', usersCtrl.search);
module.exports = router;
