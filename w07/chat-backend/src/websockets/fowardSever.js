import { createServer } from 'http';
import { WebSocketServer } from 'ws';

//create an HTTP server
const forwardServer = createServer();

//create websocket server
const wss = new WebSocketServer({ server: forwardServer });
// listen wss
wss.on('listening', () => {
    console.log(`[Forward Server,  ${wss.clients.size}] - listening`);
});

// connection
wss.on('connection', (ws, req) => {
    console.log(`[Forward Server,  ${wss.clients.size}] - client connected`);
    //message arrival
    ws.on('message', (message) => {
        const messageString = message.toString();
        console.log(`[Forward Server,  ${wss.clients.size}] - received ${messageString}`);

        //forward message to all clients except sender
        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(messageString);
                console.log(`[Forward Server,  ${wss.clients.size}] - forwarded ${messageString}`);
            }
        });
    });

    ws.on('close', () => {
        console.log(`[Forward Server,  ${wss.clients.size}] - closed`);
    });
});

export default forwardServer;