import { formatMessage } from './utils.js';

function consoleAppender(date, level, category, message, formatter) {
    console.log(formatMessage(date, level, category, message, formatter));
}

export default { log: consoleAppender };
