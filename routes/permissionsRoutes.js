const router = require('express').Router();
const usersCtrl = require('../controllers/usersController');
const userPermissionContoller = require('../controllers/userPermissionsController');

router.get('/', usersCtrl.getPermissions);

router.get('/getPermission',userPermissionContoller.getPermission);
router.post('/updatePermissions', userPermissionContoller.updatePermissions);
router.get('/userinfo/:userid', usersCtrl.userinfo);


module.exports = router;
