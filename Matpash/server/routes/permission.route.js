const express = require('express');
const usersContoller = require('../controllers/users.controller');
const userPermissionContoller = require('../controllers/user_permission.controller');
const router = express.Router();

router.get('/getPermission',userPermissionContoller.getPermission);
router.post('/updatePermissions', userPermissionContoller.updatePermissions);
router.get('/userinfo/:userid', usersContoller.userinfo);



module.exports = router;