const express = require('express');
const dashboardContoller = require('../controllers/dashboard.controller');
const router = express.Router();

router.get('/getbyid/:id', dashboardContoller.getDashboardById);
router.delete('/deletebyid/:id', dashboardContoller.deleteDashboardById);
router.post('/addnew', dashboardContoller.addNewDashboard);
router.post('/update', dashboardContoller.updateDashboardById);


module.exports = router;