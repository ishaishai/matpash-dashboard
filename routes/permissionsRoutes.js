const router = require('express').Router();
const usersCtrl = require('../controllers/usersController');
const userPermissionContoller = require('../controllers/userPermissionsController');
const requireToken = require('../middlewares/requireToken');

router.get('/', usersCtrl.getPermissions);

router.get('/getPermission/:page',requireToken,userPermissionContoller.getPermission);
router.post('/updatePermissions', requireToken,userPermissionContoller.updatePermissions);
router.get('/userinfo/:userid', requireToken,usersCtrl.userinfo);


module.exports = router;
