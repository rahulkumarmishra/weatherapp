const axios = require('axios');
const Model = require('../models');

async function getWeatherData(latitude, longitude) {
  try {
    const weatherKey = await Model.api_keys.findOne({ 
      where: { service_name: 'openweather' } 
    });
    
    if (!weatherKey) {
      throw new Error('OpenWeather API key not configured');
    }
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherKey.api_key}`;
    const response = await axios.get(weatherUrl);
    
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

module.exports = {
  getWeatherData
};