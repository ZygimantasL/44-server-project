import http, { IncomingMessage, ServerResponse } from 'node:http';
import { StringDecoder } from 'node:string_decoder';
import { file } from './file.js';

// PAGES
import { pgHome } from '../pages/pgHome.js';
import { pg404 } from '../pages/pg404.js';
import { pgRegister } from '../pages/pgRegister.js';
import { pgServices } from '../pages/pgServices.js';
import { pgLogin } from '../pages/pgLogin.js';
import { pgAccount } from '../pages/pgAccount.js';

// API
import { registerAPI } from '../api/register.js';
import { loginAPI } from '../api/login.js';
import { cookieParser, isUserLoggedIn } from './utils.js';

export type APIresponse = {
    statusCode: number,
    headers: Record<string, any>,
    body: string | undefined,
}

const serverLogic = async (req: IncomingMessage, res: ServerResponse) => {
    // Susitvarkome URL
    const baseUrl = `http://${req.headers.host}`;
    const parsedUrl = new URL(req.url ?? '', baseUrl);
    const httpMethod = req.method?.toLowerCase() ?? 'get';
    const trimmedPath = parsedUrl.pathname
        .replace(/^\/+|\/+$/g, '')
        .replace(/\/+/g, '/');

    // Kokio resurso nori klientas?
    const textFileExtensions = ['css', 'js', 'webmanifest', 'svg'];
    const binaryFileExtensions = ['png', 'jpg', 'ico'];
    const extension = (trimmedPath.includes('.') ? trimmedPath.split('.').at(-1) : '') as string;

    const isTextFile = textFileExtensions.includes(extension);
    const isBinaryFile = binaryFileExtensions.includes(extension);
    const isAPI = trimmedPath.startsWith('api/');
    const isPage = !isTextFile && !isBinaryFile && !isAPI;

    type Mimes = Record<string, string>;
    const MIMES: Mimes = {
        html: 'text/html',
        css: 'text/css',
        js: 'text/javascript',
        json: 'application/json',
        txt: 'text/plain',
        svg: 'image/svg+xml',
        xml: 'application/xml',
        ico: 'image/vnd.microsoft.icon',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        woff2: 'font/woff2',
        woff: 'font/woff',
        ttf: 'font/ttf',
        webmanifest: 'application/manifest+json',
    };

    let responseStatusCode = 200;
    let responseContent: string | Buffer | undefined = '';
    let buffer = '';
    const stringDecoder = new StringDecoder('utf-8');

    // Upload? API POST request?
    req.on('data', (data) => {
        buffer += stringDecoder.write(data);
    });

    // Galutinis sprendimas ir atsakymas klientui
    req.on('end', async () => {
        buffer += stringDecoder.end();

        if (isTextFile) {
            const [err, msg] = await file.readPublic(trimmedPath);

            if (err) {
                res.statusCode = 404;
                responseContent = `Error: could not find file: ${trimmedPath}`;
            } else {
                res.writeHead(responseStatusCode, {
                    'Content-Type': MIMES[extension],
                })
                responseContent = msg;
            }
        }

        if (isBinaryFile) {
            const [err, msg] = await file.readPublicBinary(trimmedPath);

            if (err) {
                res.statusCode = 404;
                responseContent = `Error: could not find file: ${trimmedPath}`;
            } else {
                res.writeHead(responseStatusCode, {
                    'Content-Type': MIMES[extension],
                })
                responseContent = msg;
            }
        }

        if (isAPI) {
            const baseHeaders = {
                'Content-Type': MIMES.json,
            };
            let apiRes = {} as APIresponse;
            let jsonData = {};
            try {
                jsonData = JSON.parse(buffer);
            } catch (error) { }

            const [_, endpoint, ...restUrlParts] = trimmedPath.split('/') as [string, string, string[]];
            const apiFunction = apiEndpoints[endpoint];
            if (apiFunction) {
                apiRes = await apiFunction(httpMethod, restUrlParts, jsonData) as APIresponse;
            } else {
                apiRes = {
                    statusCode: 200,
                    headers: {},
                    body: 'TOKS API ENDPOINTAS NEEGZISTUOJA!!!'
                };
            }

            res.writeHead(apiRes.statusCode, {
                ...baseHeaders,
                ...apiRes.headers,
            });
            responseContent = JSON.stringify(apiRes.body);
        }

        if (isPage) {
            res.writeHead(responseStatusCode, {
                'Content-Type': MIMES.html,
            });

            const cookiesObj: Record<string, string> = cookieParser(req.headers.cookie ?? '');
            const isLoggedIn = await isUserLoggedIn(cookiesObj['session-token']);
            let PageClass = publicPages['404'];

            if (isLoggedIn && trimmedPath in protectedPages) {
                PageClass = protectedPages[trimmedPath];
            }

            if (trimmedPath in publicPages) {
                PageClass = publicPages[trimmedPath];
            }

            responseContent = new PageClass().render();
        }

        res.end(responseContent);
    });
};

export const publicPages: Record<string, any> = {
    '': pgHome,
    'services': pgServices,
    'register': pgRegister,
    'login': pgLogin,
    '404': pg404,
};

export const protectedPages: Record<string, any> = {
    'account': pgAccount,
};

export const apiEndpoints: Record<string, any> = {
    'register': registerAPI,
    'login': loginAPI,
};

const httpServer = http.createServer(serverLogic);

export const init = () => {
    httpServer.listen(4415, () => {
        console.log(`Server running at http://localhost:4415`);
    })
};

export const server = {
    init,
    httpServer,
    pages: publicPages,
};

export default server;