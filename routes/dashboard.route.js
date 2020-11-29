const express = require('express');
const dashboardContoller = require('../controllers/dashboardController');
const router = express.Router();
const requireToken = require('../middlewares/requireToken');

router.get('/get-by-id/:id', requireToken, dashboardContoller.getDashboardById);
router.post('/set-default/:id', requireToken, dashboardContoller.setDefaultDashboard);
router.get(
  '/get-dashboard-names/:page',
  requireToken,
  dashboardContoller.getDashboardNames,
);
router.delete(
  '/delete-dashboard-by-id/:id',
  requireToken,
  dashboardContoller.deleteDashboardById,
);
router.delete(
  '/remove-graph-from-dashboard/:dashboard_id/:graph_id',
  requireToken,
  dashboardContoller.deleteGraphFromDashboard,
);
router.post(
  '/add-new-dashboard',
  requireToken,
  dashboardContoller.addNewDashboard,
);
router.post(
  '/add-new-graph-to-dashboard',
  requireToken,
  dashboardContoller.addNewGraphToDashboard,
);
router.post('/update', requireToken, dashboardContoller.updateDashboardById);

module.exports = router;
