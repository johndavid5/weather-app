import React from "react";
import { useState, useEffect } from 'react';
import { WeatherService } from '../services/weather.service'
import { useObservable } from "rxjs-hooks";
import { Utils } from '../shared/Utils';
import { TemperatureUnits } from '../models/TemperatureUnits'
import { Logger } from '../shared/Logger';
import "../App.css";

function SearchForm() {
  const [cityState, setCityState] = useState('New York,USA');

  const [isFetching, setIsFetching] = useState(false);

  const [temperatureUnits, setTemperatureUnits] = useState(TemperatureUnits.FAHRENHEIT);

  // Special useObservable hook...to hook into RxJS observables...
  const weather = useObservable(() => WeatherService.getInstance().observeWeather(), {});


  // NOTE: useEffect(...,[]): Empty array causes it to be invoked only upon the initial render...
  useEffect(() => {
    let sWho = 'SearchForm::useEffect[](for initial render only)'
    Logger.debug(`${sWho}: Calling submitForm(null)...`);

    // Load the default city's weather when the page loads...
    submitForm(null);
  }, []);
  

  useEffect(() => {
    let sWho = 'SearchForm::useEffect[weather]';
    Logger.debug(`${sWho}: The weather is now:`, weather);
    Logger.debug(`${sWho}: Calling setIsFetching(false)...`);
    setIsFetching(false);
  }, [weather]);

  const onChangeCityState = (event: any) => {
    setCityState(event.target.value);
  };

  const submitForm = (event:any) => {
    let sWho = 'SearchForm::submitForm';
    if(event){
      event.preventDefault();
    }
    Logger.debug(`${sWho}(): Calling setIsFetching(true)...`);
    setIsFetching(true);
    Logger.debug(`${sWho}(): Calling WeatherService.getInstance().fetchWeather(cityState = `, cityState, `)`);
    WeatherService.getInstance().fetchWeather(cityState);
  }

  const onSetTemperatureUnits = (event: any, temperatureUnits: TemperatureUnits) => {
    let sWho = 'SearchForm.onSetTemperatureUnits'
    event.preventDefault();
    Logger.debug(`${sWho}(): Calling setTemperatureUnits(`, temperatureUnits, `)...`);
    setTemperatureUnits(temperatureUnits);
    Logger.debug(`${sWho}(): Calling WeatherService.getInstance().setTemperatureUnits(`, temperatureUnits, `)...`);
    WeatherService.getInstance().setTemperatureUnits(temperatureUnits);
  }

  const temperatureUnitsClass = (controlTempUnits: TemperatureUnits): string => {
    let sOut = "temperature-units";
    if(temperatureUnits===controlTempUnits){
      sOut += " current";
    }
    return sOut;
  }

  return (
    <>
      <form onSubmit={(e)=>submitForm(e)}>
      City[,State or Province][,Country]:&nbsp;<input type="text" value={cityState} onClick={(e)=>submitForm(e)} onChange={onChangeCityState}></input><br />
      <br />
      <button className="button button1" type="submit">Fetch{isFetching ? 'ing' : ''} Weather for {cityState}...</button><br /><br />
      <a href=""
         className={temperatureUnitsClass(TemperatureUnits.FAHRENHEIT)}
         onClick={(e)=>onSetTemperatureUnits(e, TemperatureUnits.FAHRENHEIT)}>&deg; F</a>
         &nbsp;&nbsp;
      <a href=""
         className={temperatureUnitsClass(TemperatureUnits.CENTIGRADE)}
         onClick={(e)=>onSetTemperatureUnits(e, TemperatureUnits.CENTIGRADE)}>&deg; C</a>
      <span style={{position: "relative"}}>
      {isFetching ? <div className="loader" style={{position: "absolute", zIndex: 1, left: "-116px", top: "0"}}></div> : ''}
      </span>
      </form>
    </>
  );
}

function CurrentWeather() {

  const weather = useObservable(() => WeatherService.getInstance().observeWeather(), {});

  const temperatureUnits = useObservable(() => WeatherService.getInstance().observeTemperatureUnits(), { temperatureUnits: TemperatureUnits.FAHRENHEIT} );

  useEffect(() => {
    let sWho = 'CurrentWeather::useEffect[weather]'
    Logger.debug(`${sWho}: The weather is now:`, weather);
  }, [weather]);

  useEffect(() => {
    let sWho = 'CurrentWeather::useEffect[temperatureUnits]'
    Logger.debug(`${sWho}: The temperatureUnits are now:`, temperatureUnits);
  }, [temperatureUnits]);


  const tempUnitsPretty = (temperatureUnits:TemperatureUnits) : string =>{
    if(temperatureUnits===TemperatureUnits.FAHRENHEIT){
      return "F";
    }
    else if(temperatureUnits===TemperatureUnits.CENTIGRADE){
      return "C";
    }
    else{
      return "?";
    }
  }

  return (
    <>
      <h2>Current Weather</h2>
      {weather.forecast ?
      <div>
      <h4>Conditions in {weather.forecast.name }...{Utils.formatDateTime(weather.forecast.dt)}:</h4>
      <span>{weather.forecast.weather[0].description}</span><img src={'http://openweathermap.org/img/w/' + weather.forecast.weather[0].icon + '.png'} />
      <h4>{Utils.formatTemperature(weather.forecast.main.temp, temperatureUnits.temperatureUnits)}&deg;{tempUnitsPretty(temperatureUnits.temperatureUnits)}</h4>
      <span>feels like: {Utils.formatTemperature(weather.forecast.main.feels_like, temperatureUnits.temperatureUnits)}&deg;{tempUnitsPretty(temperatureUnits.temperatureUnits)}</span>
      </div>
      :
      ''
      }
    </>
  );
}


function App() {
  
  return (
    <>
      <h1>Weather...or Not...?</h1>
      <SearchForm />
      <CurrentWeather />
    </>
  );

}

export default App;
