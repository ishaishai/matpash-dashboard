const express = require('express');
const uploadCtrl = require('../controllers/uploadController');
const router = express.Router();

router.post('/', uploadCtrl.upload);
router.post('/check-excel', uploadCtrl.checkExcel);

module.exports = router;