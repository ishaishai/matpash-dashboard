const express = require('express');
const router = express.Router();
const tableContoller = require('../controllers/table.controller');

router.get('/get-names', tableContoller.getTablesName);
router.get('/get-cols/:table_name', tableContoller.getColFromTable);
router.get('/get-first-column/:table_name', tableContoller.getPeriodStart);
router.get('/get-period-end/:table_name/:start', tableContoller.getPeriodEnd);

module.exports = router;
