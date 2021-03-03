const router = require('express').Router();
const usersCtrl = require('../controllers/usersController');
const requireToken = require('../middlewares/requireToken');
const checkTestUser = require('../middlewares/checkTestUser');

router.get('/', requireToken, usersCtrl.getUsers);

router.get('/getall', requireToken, usersCtrl.getall);
router.get('/userinfo/:username', requireToken, usersCtrl.userinfo);
router.get('/page/:page', requireToken, usersCtrl.page);
router.get('/search/:page', requireToken, usersCtrl.search);
router.delete(
  '/delete-user/:username',
  requireToken,
  checkTestUser,
  usersCtrl.deleteUser,
);
router.post('/update-user', requireToken, checkTestUser, usersCtrl.updateUser);
module.exports = router;
