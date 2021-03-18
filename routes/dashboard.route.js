const express = require('express');
const dashboardContoller = require('../controllers/dashboardController');
const router = express.Router();
const requireToken = require('../middlewares/requireToken');
const checkTestUser = require('../middlewares/checkTestUser');

router.get('/get-by-id/:id', requireToken, dashboardContoller.getDashboardById);
router.post(
  '/set-default/:id',
  requireToken,
  checkTestUser,
  dashboardContoller.setDefaultDashboard,
);
router.get(
  '/get-dashboard-names/:page',
  requireToken,
  dashboardContoller.getDashboardNames,
);
router.get('/get-goldens', requireToken, dashboardContoller.getGoldens);
router.delete(
  '/delete-dashboard-by-id/:id',
  requireToken,
  checkTestUser,
  dashboardContoller.deleteDashboardById,
);
router.delete(
  '/remove-graph-from-dashboard/:dashboard_id/:graph_id',
  requireToken,
  checkTestUser,
  dashboardContoller.deleteGraphFromDashboard,
);

router.delete(
  '/remove-golden/:index',
  requireToken,
  checkTestUser,
  dashboardContoller.deleteGolden,
);

router.post(
  '/add-new-dashboard',
  requireToken,
  checkTestUser,
  dashboardContoller.addNewDashboard,
);
router.post(
  '/add-new-graph-to-dashboard',
  requireToken,
  checkTestUser,
  dashboardContoller.addNewGraphToDashboard,
);

router.post(
  '/add-new-golden',
  requireToken,
  checkTestUser,
  dashboardContoller.addNewGolden,
);

router.post(
  '/update',
  requireToken,
  checkTestUser,
  dashboardContoller.updateDashboardById,
);
router.post(
  '/update-graph-info',
  requireToken,
  checkTestUser,
  dashboardContoller.updateGraphInfo,
);
module.exports = router;
