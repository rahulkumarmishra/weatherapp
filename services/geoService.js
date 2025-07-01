const axios = require('axios');
const Model = require('../models');

async function geocodeAddress(address) {
  try {
    const mapboxKey = await Model.api_keys.findOne({ 
      where: { service_name: 'mapbox' } 
    });
    
    if (!mapboxKey) {
      throw new Error('Mapbox API key not configured');
    }
    
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxKey.api_key}`;
    const response = await axios.get(geocodeUrl);
    
    if (response.data.features.length === 0) {
      throw new Error('Address not found');
    }
    
    const [longitude, latitude] = response.data.features[0].center;
    const placeName = response.data.features[0].place_name;
    
    return { latitude, longitude, placeName };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

module.exports = {
  geocodeAddress
};