import fs from 'fs';
import { formatMessage } from './utils.js';
import * as constants from '../constants.js';
import { stringify } from 'csv-stringify';

async function fileAppender(date, level, category, message, formatter) {
    const logFile =
        level === constants.level.ERROR
            ? constants.files.LOG_ERROR_FILE
            : constants.files.LOG_FILE;
    let logMessage;

    if (formatter === constants.format.CSV) {
        const data = [{ date, level, category, message }];
        logMessage = await stringify(data, { header: true });
        await appendToFile(logFile, logMessage);
    } else {
        logMessage =
            (await formatMessage(date, level, category, message, formatter)) +
            '\n';
        await appendToFile(logFile, logMessage);
    }
}
async function appendToFile(logFile, data) {
    try {
        if (!fs.existsSync(logFile)) {
            await fs.promises.writeFile(logFile, '');
        }
        await fs.promises.appendFile(logFile, data, { flag: 'a' });
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}

export default { log: fileAppender };
