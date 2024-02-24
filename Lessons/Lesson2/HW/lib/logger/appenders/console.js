import { formatMessage } from './utils.js';

function consoleAppender(date, level, category, message) {
    console.log(formatMessage(date, level, category, message));
}

export default { log: consoleAppender };
