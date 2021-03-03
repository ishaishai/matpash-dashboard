const router = require('express').Router();
const statisticsCtrl = require('../controllers/statisticsController');
const requireToken = require('../middlewares/requireToken');
const checkTestUser = require('../middlewares/checkTestUser');

router.get('/', requireToken, checkTestUser, statisticsCtrl.getStatistics);

module.exports = router;
