const express = require('express');
const usersContoller = require('../controllers/usersController');
const ViewPermissionContoller = require('../controllers/viewPermissionsController');
const router = express.Router();

router.get('/getViewPermission', ViewPermissionContoller.getViewPermission);

router.post('/saveViewPermission',ViewPermissionContoller.saveViewPermission);

router.get('/userinfo/:userid', usersContoller.userinfo);

module.exports = router;


