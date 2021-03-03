const express = require('express');
const usersContoller = require('../controllers/usersController');
const ViewPermissionContoller = require('../controllers/viewPermissionsController');
const requireToken = require('../middlewares/requireToken');
const checkTestUser = require('../middlewares/checkTestUser');
const router = express.Router();

router.get(
  '/getViewPermission',
  requireToken,
  ViewPermissionContoller.getViewPermission,
);

router.post(
  '/saveViewPermission',
  requireToken,
  checkTestUser,
  ViewPermissionContoller.saveViewPermission,
);

router.get('/userinfo/:userid', requireToken, usersContoller.userinfo);

module.exports = router;
