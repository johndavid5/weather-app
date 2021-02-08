import { format } from 'date-fns';

import { LoggerLevel } from './LoggerLevel';
import { LOGGER_LEVEL } from './config';

export class Logger {
    private static loggerLevel: LoggerLevel = LOGGER_LEVEL;

    // Reverse map of LoggerLevel enum value to enum name...
    static keyMap: { [key: string]: any } = {};
    static keyMapLoaded = false;
    
    static _generateKeyMap():  { [key: string]: any } {
        // let sWho = 'Logger._generateKeyMap';
        const theMap : { [key: string]: any } = {};
        Object.keys(LoggerLevel).forEach((x:any) => {
            const xInt = parseInt(x);
            if (!Number.isNaN(xInt)) {
                theMap[""+xInt] = ""+LoggerLevel[x];
            }
        });

        // console.log(`${sWho}: theMap =`, theMap);
        return theMap;
    }

    static loggerLevelToString(loggerLevel: LoggerLevel): string {

        // let sWho = `Logger::loggerLevelToString`;
        // console.log(`${sWho}: loggerLevel = `, loggerLevel );

        if( !Logger.keyMapLoaded ){
            // Lazy initialization...
            Logger.keyMap = Logger._generateKeyMap();
            Logger.keyMapLoaded = true;
        }

        let returno = Logger.keyMap[loggerLevel];
        // console.log(`${sWho}: returno = `, returno );

        if (!returno || returno === undefined ) {
            return "???";
        }
        else {
            return returno;
        }

    }

    static setLevel(level: LoggerLevel): void {
        Logger.loggerLevel = level;
        // console.log(
        //     `Logger.setLevel(): loggerLevel = `,
        //     this.loggerLevel,
        //     ` = `,
        //     Logger.loggerLevelToString(this.loggerLevel)
        // );
    }

    static getLevel(): LoggerLevel {
        return this.loggerLevel;
    }

    /**
     * You can use wouldLog() for the case where you're using JSON.stringify()
     * to create log messages and don't want to waste resources doing
     * an expensive JSON.stringify for nothing.  For example,
     * if( logger.wouldLog( LoggerLevel.TRACE )){
     *     logger.trace("The big structure is ", JSON.stringify(theBigStructure))
     * }
     */
    static wouldLog(messageLevel: LoggerLevel): boolean {
        return messageLevel >= Logger.loggerLevel;
    }

    static log(messageLevel: LoggerLevel, ...args: any[]): void {
        // console.log(`Logger.log(): messageLevel = `, messageLevel, `loggerLevel = `, this.loggerLevel, `messageLevel >= loggerLevel = `, (messageLevel >= this.loggerLevel ) );
        if (Logger.wouldLog(messageLevel)) {
            console.log(
                `[${format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')}][${Logger.loggerLevelToString(
                    messageLevel
                )}]:`,
                ...args
            );
        }
    }

    static trace(...args: any[]): void {
        Logger.log(LoggerLevel.TRACE, ...args);
    }

    static debug(...args: any[]): void {
        Logger.log(LoggerLevel.DEBUG, ...args);
    }

    static info(...args: any[]): void {
        Logger.log(LoggerLevel.INFO, ...args);
    }

    static warn(...args: any[]): void {
        Logger.log(LoggerLevel.WARN, ...args);
    }

    static error(...args: any[]): void {
        Logger.log(LoggerLevel.ERROR, ...args);
    }
}