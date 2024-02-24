import fs from 'fs';
import { formatMessage } from './utils.js';
import * as constants from '../constants.js';

function fileAppender(date, level, category, message) {
    const logMessage = formatMessage(date, level, category, message) + '\n';
    const logFile =
        level === constants.level.ERROR
            ? constants.files.LOG_ERROR_FILE
            : constants.files.LOG_FILE;
    createFile(logFile, logMessage);
}

function createFile(logFile, logMessage) {
    try {
        if (!fs.existsSync(logFile)) {
            fs.writeFileSync(logFile, '');
        }
        fs.appendFileSync(logFile, logMessage, { flag: 'a' });
    } catch (err) {
        console.error('Error writing to log file:', err);
    }
}

export default { log: fileAppender };
