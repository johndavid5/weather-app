import { format } from 'date-fns';
import { TemperatureUnits } from '../models/TemperatureUnits';
import { Logger } from './Logger';

export class Utils {

  static fetchWeather(cityName: string): Promise<any> {
    let sWho = 'Utils::fetchWeather';

    const API_KEY = "5d88c8ba5c93bf166fb7c23ce5c36841";
    // TODO: fetch weather forecast from endpoint
    // from https://openweathermap.org/api
    // e.g., `https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=${API_KEY}`;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${API_KEY}`;
    Logger.info(`${sWho}(): returning fetch(url), url = "${url}"...`);
    return fetch(url);
  }

  static formatDateTime(epochTimestampSeconds: number): string {
    let sWho = 'Utils::formatDateTime';
    Logger.trace(`${sWho}(): epochTimestampSeconds =`, epochTimestampSeconds);
    let sFormat = "PPPPpppp";
    return format(new Date(epochTimestampSeconds * 1000), sFormat);
  }

  static formatTemperature(temperatureKelvin: number, temperatureUnits: TemperatureUnits): string {
    let sWho = 'Utils::formatTemperature';
    Logger.trace(`${sWho}(): temperatureKelvin =`, temperatureKelvin);
    let temperatureCelsius = temperatureKelvin + -273;
    Logger.trace(`${sWho}(): temperatureCelsius =`, temperatureCelsius);
    let temperatureFahrenheit = (temperatureCelsius * 1.8) + 32;
    Logger.trace(`${sWho}(): temperatureFahrenheit =`, temperatureFahrenheit);

    if(temperatureUnits === TemperatureUnits.FAHRENHEIT){
      return "" + temperatureFahrenheit.toFixed(1); // Round to 1 decimal place...
    }
    else if(temperatureUnits === TemperatureUnits.CENTIGRADE){
      return "" + temperatureCelsius.toFixed(1); // Round to 1 decimal place...
    }
    else{
      return "?";
    }
  }

}/* class Utils */