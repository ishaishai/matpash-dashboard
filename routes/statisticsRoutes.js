const router = require('express').Router();
const statisticsCtrl = require('../controllers/statisticsController');

router.get('/', statisticsCtrl.getStatistics);

module.exports = router;
