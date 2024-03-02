import fs from 'fs';
import * as constants from '../constants.js';
import { formatMessage } from './utils.js';

async function fileAppender(date, level, category, message, formatter) {
    const logMessage = await formatMessage(
        date,
        level,
        category,
        message,
        formatter
    );
    await appendToFile(constants.files.LOG_FILE, logMessage);
    if (level === constants.level.ERROR) {
        await appendToFile(constants.files.LOG_ERROR_FILE, logMessage);
    }
}

async function appendToFile(logFile, data) {
    try {
        await fs.promises.appendFile(logFile, data, { flag: 'a' });
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}

export default { log: fileAppender };
