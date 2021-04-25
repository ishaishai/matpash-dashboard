const express = require('express');
const router = express.Router();
const conceptsCtrl = require('../controllers/conceptsController');
const requireToken = require('../middlewares/requireToken');
const checkTestUser = require('../middlewares/checkTestUser');

router.get('/get-all', requireToken, conceptsCtrl.getAllConcepts);
router.post('/add-concept', requireToken, conceptsCtrl.addConcept);
router.post('/delete-concept', requireToken, conceptsCtrl.deleteConcept);
module.exports = router;
