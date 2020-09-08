const router = require('express').Router();
const usersCtrl = require('../controllers/usersController');

router.get('/', usersCtrl.getUsers);

module.exports = router;
