const express = require('express');
const router = express.Router();
const tableContoller = require('../controllers/table.controller');

router.get('/get-names', tableContoller.getTablesName);
router.post('/get-cols', tableContoller.getColFromTable);

module.exports = router;