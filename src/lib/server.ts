import http, { IncomingMessage, ServerResponse } from 'node:http';
import { file } from './file.js';
type Server = {
    init: () => void;
    httpServer: any;
}
const server = {} as Server;

server.httpServer = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    console.log(req.url);
    let responseContent = '';

    return res.end(responseContent);
});

server.init = () => {
    server.httpServer.listen(4415, () => {
        console.log('Serveris sukasi ant http://localhost:4415');
    });
};


export {server};