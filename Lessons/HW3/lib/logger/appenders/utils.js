import * as constants from '../constants.js';

async function formatMessage(date, level, category, message, formatter) {
    if (formatter === constants.format.JSON) {
        return JSON.stringify({ date, level, category, message });
    } else if (formatter === constants.format.CSV) {
        const data = [{ date, level, category, message }];
        return data;
    } else {
        return `Date: ${date}, category: ${category}, level: ${level}, message: ${JSON.stringify(
            message
        )}`;
    }
}

export { formatMessage };