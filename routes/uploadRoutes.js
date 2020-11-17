const express = require('express');
const uploadCtrl = require('../controllers/uploadController');
const router = express.Router();

router.post('/save-excel', uploadCtrl.saveExcel);
router.post('/check-excel', uploadCtrl.checkExcel);

module.exports = router;