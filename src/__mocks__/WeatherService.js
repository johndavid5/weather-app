// https://github.com/facebook/jest/issues/3766

// let ContentLoader = require.requireActual("../src/contentLoader.js").ContentLoader;

// ContentLoader._loadImage = function() {
//   return "teeehee";
// };
import { Observable, of } from 'rxjs';
import { TemperatureUnits } from '../models/TemperatureUnits';

const weatherFixture = 
  {
    "isFixture": true,
    "coord": {
     "lon": -74.006,
     "lat": 40.7143
    },
    "weather": [
     {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01n"
     }
    ],
    "base": "stations",
    "main": {
     "temp": 269.77,
     "feels_like": 265.58,
     "temp_min": 269.15,
     "temp_max": 271.15,
     "pressure": 1020,
     "humidity": 80
    },
    "visibility": 10000,
    "wind": {
     "speed": 2.06,
     "deg": 0
    },
    "clouds": {
     "all": 1
    },
    "dt": 1612763019,
    "sys": {
     "type": 1,
     "id": 4610,
     "country": "US",
     "sunrise": 1612785505,
     "sunset": 1612822927
    },
    "timezone": -18000,
    "id": 5128581,
    "name": "New York",
    "cod": 200
   };

// module.exports = ContentLoader;
let WeatherService = require.requireActual('../services/weather.service').WeatherService;
WeatherService.observeWeather = function(){
    let output = { weather: weatherFixture };
    console.log('WeatherServiceMock::observeWeather: returning of(', output, ')');
    return of(output); // Return an Observable that serves up the output...
}

WeatherService.observeTemperatureUnits = function(){
    console.log(`WeatherServiceMock::observeTemperatureUnits: returning of(`, TemperatureUnits.FAHRENHEIT, `)` );
    return of(TemperatureUnits.FAHRENHEIT); // Return an Observable that serves up the output...
}