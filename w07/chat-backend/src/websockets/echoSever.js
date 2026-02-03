import { createServer } from 'http';
import { WebSocketServer } from 'ws';

//create an HTTP server
const echoServer = createServer();

//create websocket server
const wss = new WebSocketServer({ server: echoServer });

// listen wss
wss.on('listening', () => {
    console.log(`[Echo Server,  ${wss.clients.size}] - listening`);
});

// connection
wss.on('connection', (ws, req) => {
    console.log(`[Echo Server,  ${wss.clients.size}] - client connected`);

    //message arrival
    ws.on('message', (message) => {
        const messageString = message.toString();
        console.log(`[Echo Server,  ${wss.clients.size}] - received ${messageString}`);
        ws.send(messageString);
        console.log(`[Echo Server,  ${wss.clients.size}] - send ${messageString}`);
    });

    ws.on('close', () => {
        console.log(`[Echo Server,  ${wss.clients.size}] - closed`);
    });
});



export default echoServer;