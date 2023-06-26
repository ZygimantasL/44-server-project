import http, { IncomingMessage, ServerResponse } from 'node:http';
import { file } from './file.js';

type Server = {
    init: () => void;
    httpServer: any;
}

const server = {} as Server;
server.init = () => {
    console.log('Inicijuojame serveri...');
}

server.init = () => {
    server.httpServer.listen(3015, () => {
        console.log('Serveris sukasi ant http://localhost:3015');       
    });
};

export { server };