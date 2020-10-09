const express = require('express');
const usersContoller = require('../controllers/users.controller');
const router = express.Router();

router.get('/getall', usersContoller.getall);
router.get('/userinfo/:userid', usersContoller.userinfo);
router.get('/page/:page', usersContoller.page);

router.get('/search/:page', usersContoller.search);


module.exports = router;


