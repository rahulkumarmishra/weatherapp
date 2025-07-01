$(document).ready(function() {
  // Get Weather Button Click
  $('#getWeatherBtn').click(function() {
    const address = $('#address').val().trim();
    if (!address) {
      alert('Please enter an address');
      return;
    }
    
    $.ajax({
      url: '/api/weather',
      method: 'POST',
      data: { address },
      success: function(data) {
        displayWeather(data);
      },
      error: function(xhr, status, error) {
        alert('Error fetching weather: ' + error);
      }
    });
  });

  // Save Weather Button Click
  $('#saveWeatherBtn').click(function() {
    const address = $('#address').val().trim();
    if (!address) {
      alert('Please enter an address first and get weather data');
      return;
    }
    
    $.ajax({
      url: '/api/history',
      method: 'POST',
      data: { address },
      success: function(response) {
        alert('Weather data saved to history!');
      },
      error: function(xhr, status, error) {
        alert('Error saving weather: ' + error);
      }
    });
  });

  // Show History Button Click
  $('#showHistoryBtn').click(function() {
    $.ajax({
      url: '/api/history',
      method: 'GET',
      success: function(data) {
        displayHistory(data);
      },
      error: function(xhr, status, error) {
        alert('Error fetching history: ' + error);
      }
    });
  });

  // Display Weather Data
  function displayWeather(data) {
    const weather = data.weather;
    const html = `
      <div class="card weather-card">
        <div class="card-body">
          <h2>Weather for ${data.address}</h2>
          <div class="d-flex align-items-center">
            <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" class="weather-icon mr-3">
            <div>
              <h3 class="mb-1">${Math.round(weather.main.temp)}°C</h3>
              <p class="mb-1">${weather.weather[0].main} (${weather.weather[0].description})</p>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-6">
              <p><strong>Feels Like:</strong> ${Math.round(weather.main.feels_like)}°C</p>
              <p><strong>Humidity:</strong> ${weather.main.humidity}%</p>
              <p><strong>Pressure:</strong> ${weather.main.pressure} hPa</p>
            </div>
            <div class="col-md-6">
              <p><strong>Wind Speed:</strong> ${weather.wind.speed} m/s</p>
              <p><strong>Wind Direction:</strong> ${weather.wind.deg}°</p>
              <p><strong>Visibility:</strong> ${weather.visibility / 1000} km</p>
            </div>
          </div>
        </div>
      </div>
    `;
    $('#weatherResults').html(html);
    $('#historyResults').empty();
  }

  // Display History Data - Modified version without individual item endpoint
  function displayHistory(history) {
    if (history.length === 0) {
      $('#historyResults').html('<p>No history found</p>');
      return;
    }

    let html = '<h3>Weather History</h3><div class="list-group">';
    history.forEach(item => {
      const weatherData = JSON.parse(item.weather_data);
      
      // Handle date parsing
      let date;
      if (item.created_at instanceof Date) {
        date = item.created_at;
      } else if (typeof item.created_at === 'string') {
        date = new Date(item.created_at.replace(' ', 'T') + 'Z');
      } else {
        date = new Date();
      }
      
      const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      // Display complete weather information directly
      html += `
        <div class="list-group-item history-item">
          <div class="d-flex justify-content-between">
            <h5 class="mb-1">${item.address}</h5>
            <small>${formattedDate}</small>
          </div>
          <div class="weather-details mt-2">
            <div class="d-flex align-items-center mb-2">
              <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" class="weather-icon-sm mr-2">
              <div>
                <strong>${Math.round(weatherData.main.temp)}°C</strong> - ${weatherData.weather[0].main}
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <small><strong>Feels Like:</strong> ${Math.round(weatherData.main.feels_like)}°C</small>
              </div>
              <div class="col-6">
                <small><strong>Humidity:</strong> ${weatherData.main.humidity}%</small>
              </div>
              <div class="col-6">
                <small><strong>Wind:</strong> ${weatherData.wind.speed} m/s</small>
              </div>
              <div class="col-6">
                <small><strong>Pressure:</strong> ${weatherData.main.pressure} hPa</small>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    $('#historyResults').html(html);
    $('#weatherResults').empty();
  }
});