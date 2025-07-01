const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const historyController = require('../controllers/historyController');

// Weather API routes
router.post('/weather', weatherController.getWeather);

// History API routes
router.post('/history', historyController.saveHistory);
router.get('/history', historyController.getHistory);

module.exports = router;