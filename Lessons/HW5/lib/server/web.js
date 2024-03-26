import * as http from 'http';
import config from '../logger/config.js';
import { formatMessage } from '../logger/appenders/utils.js';

const logCache = [];
const httpServer = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/logs') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ logCache }));
        res.end();
    } else {
        res.statusCode = 404;
        res.end();
    }
});

httpServer.listen(config.httpPort, () => {
    console.log('Server started');
});

async function addToLogCache(
    date,
    level,
    category,
    message,
    formatter,
    fileName
) {
    const logMessage = await formatMessage(
        date,
        level,
        category,
        message,
        formatter,
        fileName
    );
    logCache.push(logMessage);
}

export { addToLogCache };
