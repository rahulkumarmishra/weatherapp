const Model = require('../models');
const geoService = require('../services/geoService');
const weatherService = require('../services/weatherService');

exports.saveHistory = async (req, res, next) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    // Get coordinates
    const { latitude, longitude, placeName } = await geoService.geocodeAddress(address);
    
    // Get weather data
    const weather = await weatherService.getWeatherData(latitude, longitude);

    // Save to database
    await Model.weather_history.create({
      address: placeName || address,
      latitude,
      longitude,
      weather_data: JSON.stringify(weather) // Stringify the weather object
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving history:', error);
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const history = await Model.weather_history.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    next(error);
  }
};