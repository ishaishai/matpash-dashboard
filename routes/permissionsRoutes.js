const router = require('express').Router();
const usersCtrl = require('../controllers/usersController');
const userPermissionContoller = require('../controllers/userPermissionsController');
const requireToken = require('../middlewares/requireToken');
const checkTestUser = require('../middlewares/checkTestUser');

router.get('/', usersCtrl.getPermissions);

router.get(
  '/getPermission/:page',
  requireToken,
  userPermissionContoller.getPermission,
);
router.post(
  '/updatePermissions',
  requireToken,
  checkTestUser,
  userPermissionContoller.updatePermissions,
);
router.get(':userid', requireToken, usersCtrl.userinfo);

module.exports = router;
