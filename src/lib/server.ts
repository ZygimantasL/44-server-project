import http, { IncomingMessage, ServerResponse } from 'node:http';
import { file } from './file.js';
type Server = {
    init: () => void;
    httpServer: any;
}
const server = {} as Server;

   
    server.httpServer = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
        console.log(req.url);
        const socket = req.socket as any; 
        const encryption = socket.encryption as any;
        const ssl = encryption !== undefined ? 's' : '';
    
        const baseURL = `http${ssl}://${req.headers.host}`;
        const parsedURL = new URL(req.url ?? '', baseURL);
        const httpMethod = req.method ? req.method.toLowerCase() : 'get';
        const trimmedPath = parsedURL.pathname
            .replace(/^\/+|\/+$/g, '')
            .replace(/\/\/+/g, '/');
    
        const textFileExtensions = ['css', 'js', 'svg', 'webmanifest'];
        const binaryFileExtensions = ['png', 'jpg', 'jpeg', 'webp', 'ico', 'eot', 'ttf', 'woff', 'woff2', 'otf'];
        const fileExtension = trimmedPath.slice(trimmedPath.lastIndexOf('.') + 1);
    
        const isTextFile = textFileExtensions.includes(fileExtension);
        const isBinaryFile = binaryFileExtensions.includes(fileExtension);
        const isAPI = trimmedPath.startsWith('api/');
        const isPage = !isTextFile && !isBinaryFile && !isAPI;

    let responseContent = '';
    return res.end(responseContent);
});

server.init = () => {
    server.httpServer.listen(4415, () => {
        console.log('Serveris sukasi ant http://localhost:4415');
    });
};


export {server};