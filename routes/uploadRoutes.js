const express = require('express');
const uploadCtrl = require('../controllers/uploadController');
const router = express.Router();

router.post('/', uploadCtrl.upload);

module.exports = router;