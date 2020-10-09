const express = require('express');
const usersContoller = require('../controllers/users.controller');
const ViewPermissionContoller = require('../controllers/viewPermission.controller');
const router = express.Router();

router.get('/getViewPermission', ViewPermissionContoller.getViewPermission);
router.get('/userinfo/:userid', usersContoller.userinfo);

module.exports = router;


