import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { of } from 'rxjs';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import { useObservable } from "rxjs-hooks";
import * as hooks from 'rxjs-hooks';

import App from '../components/app';
import { TemperatureUnits } from "../models/TemperatureUnits";


import { Logger } from '../shared/Logger';

// import { weatherFixture } from '../__fixtures__/weather-fixture';

/* This is an actual weather fetch for NYC 2/8/2021... */
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

//  beforeAll(() => {
//     WeatherService.mockImplementation(() => {
//       return class WeatherService {
//         static getInstance() {
//           console.log('WeatherServiceMock::getInstance');
//           if (!WeatherService.instance) {
//               WeatherService.instance = new WeatherService();
//           }
  
//           return WeatherService.instance;
//         }
//         setTemperaturUnits(){
//           console.log('WeatherServiceMock::setTemperatureUnits');
//         }
//         fetchWeather(){
//           console.log('WeatherServiceMock::fetchWeather');
//         }
//         observeWeather(){
//           let output = { weather: weatherFixture };
//           console.log('WeatherServiceMock::observeWeather: returning of(', output, ')');
//           return of(output); // Return an Observable that serves up the output...
//         }
//         observeTemperatureUnits(){
//           console.log(`WeatherServiceMock::observeTemperatureUnits: returning of(`, TemperatureUnits.FAHRENHEIT, `)` );
//           return of(TemperatureUnits.FAHRENHEIT); // Return an Observable that serves up the output...
//         }
//       };
//     });
// });

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

let descRenders = "renders with heading";
it(descRenders, () => {
  let sWho = `app-test::descRenders`;

  act(() => {
    render(<App />, container);
  });
  Logger.debug(`${sWho}: container.textContent = `, container.textContent);
  expect(container.textContent).toContain("Weather...or Not...?");

});

let descLoadsFetched = "loads fetched weather";
it(descLoadsFetched, async () => {
  let sWho = `app-test::${descLoadsFetched}`;

  let mockWeatherFixture = weatherFixture;

  Logger.debug(`${sWho}: weatherFixture = `, weatherFixture );

  Logger.debug(`${sWho}: mockWeatherFixture = `, mockWeatherFixture );

  // Set spy so fetch returns weatherFixture...
  // jest.spyOn(global, "fetch").mockImplementation(() =>
  //   Promise.resolve({
  //     json: () => Promise.resolve(weatherFixture)
  //   })
  // );

  // Mock the useObservable hook...
  // jest.mock('useObservable', () => {
  //   return jest.fn(() => {
  //      mockWeatherFixture
  //   })
  // });

  // Mock the useObservable hook...
  jest.spyOn(hooks, 'useObservable').mockImplementation((arg) => {
    console.log(`useObservable mock: arg = `, arg );
    let output = {cityState: "New York, NY", weather: mockWeatherFixture};
    console.log(`useObservable mock: returning output = `, output);
    return output;
  });

  let wrapper;
  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    wrapper = mount(<App />);
    render(<App />, container);
  });

  Logger.debug(`${sWho}: container.textContent = `, container.textContent);
  Logger.debug(`${sWho}: wrapper = `, wrapper );

  // expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  // expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  // expect(container.textContent).toContain(fakeUser.address);
  expect(container.textContent).toContain("Weather...or Not...?");

  let currentWeather = container.querySelector("CurrentWeather");
  Logger.debug(`${sWho}: currentWeather = `, currentWeather );

  // remove the mock to ensure tests are completely isolated
  // global.fetch.mockRestore();

});