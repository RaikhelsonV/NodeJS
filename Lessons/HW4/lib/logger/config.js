import * as constants from './constants.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultConfig = {
    logLevel: constants.level.INFO,
    appender: constants.appender.CONSOLE,
    formatter: constants.format.DEFAULT,
};

function initConfig() {
    const logLevel = (
        process.env.LOG_LEVEL || defaultConfig.logLevel
    ).toUpperCase();
    const appender = (
        process.env.LOG_APPENDER || defaultConfig.appender
    ).toUpperCase();
    const formatter = (
        process.env.LOG_FORMATTER || defaultConfig.formatter
    ).toUpperCase();

    return {
        logLevel: logLevel,
        appender: appender,
        scoreLevel: constants.scoreLevel[logLevel],
        formatter: formatter,
    };
}
const config = initConfig();

export default config;
