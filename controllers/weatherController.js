const geoService = require('../services/geoService');
const weatherService = require('../services/weatherService');

exports.getWeather = async (req, res, next) => {
  try {
    const { address } = req.body;
    
    // Get coordinates
    const { latitude, longitude, placeName } = await geoService.geocodeAddress(address);
    
    // Get weather data
    const weather = await weatherService.getWeatherData(latitude, longitude);
    
    res.json({
      address: placeName,
      latitude,
      longitude,
      weather
    });
  } catch (error) {
    next(error);
  }
};