import { BehaviorSubject, Observable } from 'rxjs';
import { Utils } from '../shared/Utils';
import { TemperatureUnits } from '../models/TemperatureUnits';
import { Logger } from '../shared/Logger';

/**
* A "reactive" service using RxJS...implemented as a Singleton so all clients can listen
* to the same shared instance.
*
* Clients can subscribe to the Observable `weather` member by calling
* `WeatherService.getInstance().weather`...
* ...and cause weather fetches to occur via
* `WeatherService.getInstance().fetchWeather(cityState)`
* ...
*/
export class WeatherService {

    private static instance: WeatherService;

    private weatherSubject: BehaviorSubject<any>;
    public weather: Observable<any>;

    private temperatureUnitsSubject: BehaviorSubject<any>;
    public temperatureUnits: Observable<any>;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor(
    ) {
        this.weatherSubject = new BehaviorSubject({});
        this.weather = this.weatherSubject.asObservable();

        this.temperatureUnitsSubject = new BehaviorSubject({temperatureUnits: TemperatureUnits.FAHRENHEIT});
        this.temperatureUnits = this.temperatureUnitsSubject.asObservable();
    }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): WeatherService {
        if (!WeatherService.instance) {
            WeatherService.instance = new WeatherService();
        }

        return WeatherService.instance;
    }

    setTemperatureUnits(temperatureUnits: TemperatureUnits){
        this.temperatureUnitsSubject.next({temperatureUnits: temperatureUnits});        
    }

    observeTemperatureUnits(): Observable<any>{
        return this.temperatureUnits;
    }

    observeWeather(): Observable<any>{
        return this.weather;
    }

    fetchWeather(cityState: string){
        let sWho = 'WeatherService.fetchWeather';
        let fakeDelayMilliseconds = 1000;
        setTimeout(()=>{
        Logger.debug(`${sWho}(): Calling fetchWeather(cityState = `, cityState, ')');
        Utils.fetchWeather(cityState)
            .then((response:any) => {
                Logger.debug(`${sWho}(): Got back response = `, response);
                Logger.debug(`${sWho}(): Got back response.ok = `, response.ok);
                return response.json();
            })
            .then((json:any) => {
                Logger.debug(`${sWho}(): Got back json = `, JSON.stringify(json,null,' '));
                let output = {cityState: cityState, forecast: json };
                this.weatherSubject.next(output);        
            })
            .catch((err:any) => {
                Logger.debug(`${sWho}(): Caught an error during fetch:`, err);
                let output = {cityState: cityState, error: err};
                this.weatherSubject.next(output);        
            });
        }, fakeDelayMilliseconds );
    }/* fetchWeather() */

}/* class WeatherService */