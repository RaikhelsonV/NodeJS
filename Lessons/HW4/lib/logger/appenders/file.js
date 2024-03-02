import { EventEmitter } from 'events';
import fs from 'fs';
import * as constants from '../constants.js';
import { formatMessage } from './utils.js';
import path from 'path';
import { Transform } from 'stream';

const ee = new EventEmitter();

async function fileAppender(date, level, category, message, formatter) {
    const logMessage = await formatMessage(
        date,
        level,
        category,
        message,
        formatter,
        process.argv[1]
    );
    ee.emit('log', logMessage, level);
}

ee.on('log', async (logMessage, level) => {
    await appendToFile(path.join(constants.files.LOG_FILE), logMessage);
    if (level === constants.level.ERROR) {
        await appendToFile(
            path.join(constants.files.LOG_ERROR_FILE),
            logMessage
        );
    }
});

async function appendToFile(logFile, data) {
    const writeStream = fs.createWriteStream(logFile, { flags: 'a' });

    const transform = new Transform({
        async transform(chunk, encoding, callback) {
            try {
                const logData = JSON.parse(chunk);
                const formattedData = await formatMessage([
                    logData.date,
                    logData.level,
                    logData.category,
                    logData.message,
                    logData.formatter,
                    logData.fileName,
                ]);

                this.push(formattedData.toString());
                callback();
            } catch (error) {
                callback(error); // Передаем ошибку в колбэк
            }
        },
    });

    transform.pipe(writeStream);

    transform.write(data);
    transform.end();

    writeStream.on('finish', () => {
        console.log('File closed.');
    });

    writeStream.on('error', (error) => {
        console.error('Error writing to log file:', error);
    });
}
export default { log: fileAppender };
