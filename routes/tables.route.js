const express = require('express');
const router = express.Router();
const tableContoller = require('../controllers/tableController');

router.get('/get-names', tableContoller.getTablesName);
router.get('/get-cols/:table_name', tableContoller.getColFromTable);
router.get('/get-first-column/:table_name', tableContoller.getPeriodStart);
router.get('/get-period-end/:table_name/:start', tableContoller.getPeriodEnd);
// if they want a dynamic example graph
//router.get('/get-cross-column-data/:table_name/:start/:end',tableController.getCrossColData);

module.exports = router;
