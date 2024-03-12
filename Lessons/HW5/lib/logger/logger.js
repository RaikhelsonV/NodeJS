import config from './config.js';
import * as constants from './constants.js';
import * as appenderStrategy from './appenderStategy.js';
import { addToLogCache } from '../server/web.js';

const logger = (category) => ({
    trace: (...message) => {
        executeLog(
            constants.level.TRACE,
            category,
            message.join(constants.delimetter)
        );
    },
    debug: (...message) => {
        executeLog(
            constants.level.DEBUG,
            category,
            message.join(constants.delimetter)
        );
    },
    info: (...message) => {
        executeLog(
            constants.level.INFO,
            category,
            message.join(constants.delimetter)
        );
    },
    warn: (...message) => {
        executeLog(
            constants.level.WARN,
            category,
            message.join(constants.delimetter)
        );
    },
    error: (...message) => {
        executeLog(
            constants.level.ERROR,
            category,
            message.join(constants.delimetter)
        );
    },
});

const appender = appenderStrategy.getAppender();

async function executeLog(level, category, message) {
    if (constants.scoreLevel[level] < config.scoreLevel) {
<<<<<<< HEAD
        await addToLogCache(
            formatDate(),
            level,
            category,
            message,
            config.formatter,
            constants.logFileName
        );
=======
>>>>>>> 617b935fe45a10665a643cbf9fb0941045b7cb54
        appender.log(formatDate(), level, category, message, config.formatter);
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
