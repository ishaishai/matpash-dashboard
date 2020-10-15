const router = require('express').Router();
const usersCtrl = require('../controllers/usersController');

router.get('/', usersCtrl.getPermissions);

module.exports = router;
