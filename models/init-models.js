var DataTypes = require("sequelize").DataTypes;
var _weather_history = require("./weather_history");

function initModels(sequelize) {
  var weather_history = _weather_history(sequelize, DataTypes);


  return {
    weather_history,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
