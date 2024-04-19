import {WebSocket, WebSocketServer} from 'ws';

let wss;

function init(server) {
    console.log('Starting WebSocket server...');
    wss = new WebSocketServer({server});

    wss.on('connection', function connection(ws) {
        console.log('New client connected');

        ws.on('message', function message(data) {
            console.log('received from client: %s', data);
        });

        console.log('WebSocket server initialized');
    });
}


function sendAllUserLinksCountUpdate(count) {
    console.log("sendAllUserLinksCountUpdate " + count)
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({type: 'countUpdate', data: count}));
            }
        });
    }
}
function sendTopFiveByUser(topUrls) {
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({type: 'topUpdate', data: topUrls}));
            }
        });
    }
}
function sendTopFive(topUrls) {
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({type: 'topSystemUpdate', data: topUrls}));
            }
        });
    }
}

function sendRateLimitByCode(limitList) {
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({type: 'rateLimits', data: limitList}));
            }
        });
    }
}
function sendVisitsUpdate(visitsData) {
    console.log("sendVisitsUpdate")
    for (const  one of visitsData){
        console.log("bbbbbbbbbb " +JSON.stringify(one))
    }
    if (wss) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                console.log("web socket open")
                client.send(JSON.stringify({type: 'visitsUpdate', data: visitsData}));
            }
        });
    }
}

export {init, sendVisitsUpdate, sendAllUserLinksCountUpdate, sendTopFiveByUser, sendTopFive, sendRateLimitByCode};
