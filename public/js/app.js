// Utility Functions
function showAlert(message, type, container = 'body') {
    const alertId = 'alert-' + Math.floor(Math.random() * 1000);
    const alertDiv = $(`
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `);
    
    $(container).prepend(alertDiv);
    setTimeout(() => $(`#${alertId}`).alert('close'), 5000);
}

function showLoading(container) {
    const loader = $(`
        <div class="text-center py-4 loading-indicator">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    `);
    $(container).html(loader);
}

// Main Functions
function displayWeather(data) {
    try {
        const weather = data.weather;
        const container = $('#weatherResults');
        container.empty();

        // Create card structure
        const card = $('<div>').addClass('card weather-card');
        const cardBody = $('<div>').addClass('card-body');

        // Title
        cardBody.append($('<h2>').addClass('card-title').text(`Weather for ${data.address}`));

        // Weather summary
        const summaryRow = $('<div>').addClass('d-flex align-items-center mb-3');
        summaryRow.append(
            $('<img>', {
                class: 'weather-icon mr-3',
                src: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                alt: weather.weather[0].description
            }),
            $('<div>').append(
                $('<h3>').addClass('mb-1').text(`${Math.round(weather.main.temp)}°C`),
                $('<p>').addClass('mb-1').text(`${weather.weather[0].main} (${weather.weather[0].description})`)
            )
        );
        cardBody.append(summaryRow);

        // Weather details
        const detailsRow = $('<div>').addClass('row mt-3');
        detailsRow.append(
            $('<div>', {class: 'col-md-6'}).append(
                $('<p>').html(`<strong>Feels Like:</strong> ${Math.round(weather.main.feels_like)}°C`),
                $('<p>').html(`<strong>Humidity:</strong> ${weather.main.humidity}%`),
                $('<p>').html(`<strong>Pressure:</strong> ${weather.main.pressure} hPa`)
            ),
            $('<div>', {class: 'col-md-6'}).append(
                $('<p>').html(`<strong>Wind Speed:</strong> ${weather.wind.speed} m/s`),
                $('<p>').html(`<strong>Wind Direction:</strong> ${weather.wind.deg}°`),
                $('<p>').html(`<strong>Visibility:</strong> ${weather.visibility / 1000} km`)
            )
        );
        cardBody.append(detailsRow);

        // Final assembly
        card.append(cardBody);
        container.append(card.hide().fadeIn(300));
        $('#historyResults').empty();

    } catch (error) {
        console.error('Error displaying weather:', error);
        showAlert('Error displaying weather data', 'danger', '#weatherResults');
    }
}

function displayHistory(history) {
    try {
        const container = $('#historyResults');
        container.empty();

        if (!history || history.length === 0) {
            container.append($('<p>').addClass('text-muted').text('No history found'));
            return;
        }

        // Create history title
        container.append($('<h3>').addClass('mb-3').text('Weather History'));
        
        // Create list group
        const listGroup = $('<div>').addClass('list-group');
        container.append(listGroup);

        // Add history items
        history.forEach(item => {
            try {
                const weatherData = typeof item.weather_data === 'string' ? 
                    JSON.parse(item.weather_data) : item.weather_data;
                
                const date = new Date(item.created_at);
                const listItem = $('<div>').addClass('list-group-item history-item');
                
                // Header
                listItem.append(
                    $('<div>').addClass('d-flex justify-content-between mb-2').append(
                        $('<h5>').addClass('mb-1').text(item.address),
                        $('<small>').addClass('text-muted').text(date.toLocaleString())
                    )
                );

                // Weather summary
                listItem.append(
                    $('<div>').addClass('weather-details').append(
                        $('<div>').addClass('d-flex align-items-center mb-2').append(
                            $('<img>', {
                                class: 'weather-icon-sm mr-2',
                                src: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`
                            }),
                            $('<div>').html(`<strong>${Math.round(weatherData.main.temp)}°C</strong> - ${weatherData.weather[0].main}`)
                        ),
                        $('<div>').addClass('row').append(
                            $('<div>').addClass('col-6').html(`<small><strong>Feels Like:</strong> ${Math.round(weatherData.main.feels_like)}°C</small>`),
                            $('<div>').addClass('col-6').html(`<small><strong>Humidity:</strong> ${weatherData.main.humidity}%</small>`),
                            $('<div>').addClass('col-6').html(`<small><strong>Wind:</strong> ${weatherData.wind.speed} m/s</small>`),
                            $('<div>').addClass('col-6').html(`<small><strong>Pressure:</strong> ${weatherData.main.pressure} hPa</small>`)
                        )
                    )
                );

                // Click handler
                listItem.on('click', function() {
                    displayWeather({
                        address: item.address,
                        weather: weatherData
                    });
                });

                listGroup.append(listItem);
            } catch (error) {
                console.error('Error processing history item:', item, error);
            }
        });

    } catch (error) {
        console.error('Error displaying history:', error);
        showAlert('Error displaying history data', 'danger', '#historyResults');
    }
}

// Event Handlers
function getWeather() {
    const address = $('#address').val().trim();
    if (!address) {
        showAlert('Please enter an address', 'danger');
        return;
    }
    
    showLoading('#weatherResults');
    
    $.ajax({
        url: '/api/weather',
        method: 'POST',
        data: { address },
        success: function(data) {
            displayWeather(data);
        },
        error: function(xhr, status, error) {
            showAlert('Error fetching weather: ' + error, 'danger', '#weatherResults');
        }
    });
}

function saveWeather() {
    const address = $('#address').val().trim();
    if (!address) {
        showAlert('Please enter an address first and get weather data', 'danger');
        return;
    }
    
    showLoading('#weatherResults');
    
    $.ajax({
        url: '/api/history',
        method: 'POST',
        data: { address },
        success: function(response) {
            showAlert('Weather data saved to history!', 'success');
        },
        error: function(xhr, status, error) {
            showAlert('Error saving weather: ' + error, 'danger');
        }
    });
}

function showHistory() {
    showLoading('#historyResults');
    
    $.ajax({
        url: '/api/history',
        method: 'GET',
        success: function(data) {
            displayHistory(data);
        },
        error: function(xhr, status, error) {
            showAlert('Error fetching history: ' + error, 'danger', '#historyResults');
        }
    });
}

// Document Ready
$(document).ready(function() {
    // Initialize event handlers
    $('#getWeatherBtn').on('click', getWeather);
    $('#saveWeatherBtn').on('click', saveWeather);
    $('#showHistoryBtn').on('click', showHistory);
    
    console.log('Weather app initialized');
});