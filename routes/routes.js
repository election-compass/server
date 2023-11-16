const express = require('express');
const generalController = require('../controllers/general');
const router = express.Router();

router.get('/bills', generalController.getBills);

module.exports = router;