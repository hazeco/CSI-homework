import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const broadcastServer = createServer();

const wss = new WebSocketServer({ server: broadcastServer });

let i = 0;

wss.on('listening', () => {
    console.log(`[Broadcast Server,  ${wss.clients.size}] - listening`);

    setInterval(() => {
        if (wss.clients.size > 0) {
            wss.clients.forEach((client) => {
                client.send(`Server broadcast message ${i}`);
            });
            i++;
        }
    }, 2000)
});



wss.on('connection', (ws, req) => {
    console.log(`[Broadcast Server,  ${wss.clients.size}] - client connected`);
    ws.on('message', (message) => {
        console.log(`[Broadcast Server,  ${wss.clients.size}] - received ${messageString}`);

    });
    ws.on('close', () => {
        console.log(`[Broadcast Server,  ${wss.clients.size}] - closed`);
    }
    );
});

export default broadcastServer;