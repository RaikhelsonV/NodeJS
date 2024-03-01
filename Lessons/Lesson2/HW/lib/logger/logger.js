import config from './config.js';
import * as constants from './constants.js';
import * as appenderStrategy from './appenderStategy.js';

const logger = (category) => ({
    trace: (message) => {
        executeLog(constants.level.TRACE, category, message);
    },
    debug: (message) => {
        executeLog(constants.level.DEBUG, category, message);
    },
    info: (message) => {
        executeLog(constants.level.INFO, category, message);
    },
    warn: (message) => {
        executeLog(constants.level.WARN, category, message);
    },
    error: (message) => {
        executeLog(constants.level.ERROR, category, message);
    },
});

const appender = appenderStrategy.getAppender();

function executeLog(level, category, message) {
    if (constants.scoreLevel[level] < config.scoreLevel) {
        appender.log(formatDate(), level, category, message);
    }
}

function formatDate() {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
    }-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    return formattedDate;
}

export default {
    getLogger(category) {
        return logger(category);
    },
};
