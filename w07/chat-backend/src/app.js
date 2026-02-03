import echoServer from './websockets/echoSever.js';
import broadcastServer from'./websockets/broadcastServer.js';
import forwardServer from './websockets/fowardSever.js';

echoServer.listen(3001);
broadcastServer.listen(3002);
forwardServer.listen(3003);

