import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';

// Setup log file
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, `chat-${new Date().toISOString().split('T')[0]}.log`);

// Helper function to log messages
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${JSON.stringify(message)}\n`;
  fs.appendFileSync(logFile, logEntry);
}

//create an HTTP server
const forwardServer = createServer();

//create websocket server with CORS
const wss = new WebSocketServer({ 
  server: forwardServer,
  perMessageDeflate: false,
});

// listen wss
wss.on('listening', () => {
    console.log(`[Forward Server,  ${wss.clients.size}] - listening`);
    logMessage({ event: 'server_listening', clients: wss.clients.size });
});

// connection
wss.on('connection', (ws, req) => {
    console.log(`[Forward Server,  ${wss.clients.size}] - client connected`);
    logMessage({ event: 'client_connected', clients: wss.clients.size, ip: req.socket.remoteAddress });
    
    //message arrival
    ws.on('message', (message) => {
        const messageString = message.toString();
        console.log(`[Forward Server,  ${wss.clients.size}] - received ${messageString}`);
        
        try {
          const parsedMsg = JSON.parse(messageString);
          logMessage(parsedMsg);
        } catch (e) {
          logMessage({ event: 'raw_message', data: messageString });
        }

        //forward message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(messageString);
                console.log(`[Forward Server,  ${wss.clients.size}] - forwarded ${messageString}`);
            }
        });
    });

    ws.on('close', () => {
        console.log(`[Forward Server,  ${wss.clients.size}] - closed`);
        logMessage({ event: 'client_disconnected', clients: wss.clients.size });
    });

    ws.on('error', (error) => {
        console.error(`[Forward Server] - error:`, error);
        logMessage({ event: 'error', message: error.message });
    });
});

export default forwardServer;