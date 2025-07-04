## Setup

1. Clone repository https://github.com/rahulkumarmishra/weatherapp.git
2. Run `npm install`
3. Create a config folder and file (config.json) and configure Database,
4. Create `.env` file and configure PORT,
5. Run migrations: `php artisan migrate`
6. Start server: `nodemon weather`

**Add API keys to database**
INSERT INTO api_keys (service_name, api_key) VALUES 
('mapbox', 'your_mapbox_api_key_here'),
('openweather', 'your_openweather_api_key_here');