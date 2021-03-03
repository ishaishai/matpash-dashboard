const express = require('express');
const uploadCtrl = require('../controllers/uploadController');
const requireToken = require('../middlewares/requireToken');
const checkTestUser = require('../middlewares/checkTestUser');
const router = express.Router();

router.post('/save-excel', requireToken, checkTestUser, uploadCtrl.saveExcel);
router.post('/check-excel', requireToken, checkTestUser, uploadCtrl.checkExcel);

module.exports = router;
