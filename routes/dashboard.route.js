const express = require('express');
const dashboardContoller = require('../controllers/dashboard.controller');
const router = express.Router();

router.get('/get-by-id/:id', dashboardContoller.getDashboardById);
router.get('/get-dashboard-names', dashboardContoller.getDashboarNames);
router.delete('/delete-dashboard-by-id', dashboardContoller.deleteDashboardById);
router.delete('/remove-graph-from-dashboard', dashboardContoller.deleteGraphFromDashboard);
router.post('/add-new-dashboard', dashboardContoller.addNewDashboard);
router.post('/add-new-grah-to-dashboard', dashboardContoller.addNewDashboard);
router.post('/update', dashboardContoller.updateDashboardById);


module.exports = router;

