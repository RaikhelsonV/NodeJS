import * as constants from '../constants.js';
import { stringify } from 'csv-stringify';

async function formatMessage(date, level, category, message, formatter) {
    if (formatter === constants.format.JSON) {
        const jsonLog = JSON.stringify({ date, level, category, message });
        return `${jsonLog}\n`;
    } else if (formatter === constants.format.CSV) {
        const data = [{ date, level, category, message }];
        return await stringifyAsync(data, { header: false });
    } else {
        return `Date: ${date}, category: ${category}, level: ${level}, message: ${JSON.stringify(
            message
        )}\n`;
    }
}

async function stringifyAsync(data, options) {
    return new Promise((resolve, reject) => {
        stringify(data, options, (err, output) => {
            if (err) {
                reject(err);
            } else {
                resolve(output);
            }
        });
    });
}

export { formatMessage };
