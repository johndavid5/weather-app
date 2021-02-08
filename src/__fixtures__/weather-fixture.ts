/* This is actual weather fetch for NYC 2/8/2021... */
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

export default weatherFixture;