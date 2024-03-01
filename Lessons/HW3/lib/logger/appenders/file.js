import fs from 'fs';
import * as constants from '../constants.js';
import { formatMessage } from './utils.js';

async function fileAppender(date, level, category, message, formatter) {
    const logFile =
        level === constants.level.ERROR
            ? constants.files.LOG_ERROR_FILE
            : constants.files.LOG_FILE;
    const logMessage = await formatMessage(
        date,
        level,
        category,
        message,
        formatter
    );
    await appendToFile(logFile, logMessage);
}

async function appendToFile(logFile, data) {
    try {
        await fs.promises.appendFile(logFile, data, { flag: 'a' });
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}

export default { log: fileAppender };
