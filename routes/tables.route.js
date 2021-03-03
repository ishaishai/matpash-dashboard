const express = require('express');
const router = express.Router();
const tableContoller = require('../controllers/tableController');
const requireToken = require('../middlewares/requireToken');
const checkTestUser = require('../middlewares/checkTestUser');

router.get('/get-names', requireToken, tableContoller.getTablesName);
router.get('/get-table/:table_name', requireToken, tableContoller.getTable);
router.delete(
  '/delete-table/:table_name',
  requireToken,
  checkTestUser,
  tableContoller.deleteTable,
);
router.get(
  '/get-cols/:table_name',
  requireToken,
  tableContoller.getColFromTable,
);
router.get(
  '/get-first-column/:table_name',
  requireToken,
  tableContoller.getPeriodStart,
);
router.get(
  '/get-period-end/:table_name/:start',
  requireToken,
  tableContoller.getPeriodEnd,
);
// incase of a dynamic example graph
//router.get('/get-cross-column-data/:table_name/:start/:end',tableController.getCrossColData);

module.exports = router;
