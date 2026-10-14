import http from 'node:http';
import { PORT, readJson } from './_harness.js';

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ hello: 'world' }));
    }
    if (req.method === 'GET' && req.url.startsWith('/user/')) {
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ id: req.url.slice(6) }));
    }
    if (req.method === 'POST' && req.url === '/echo') {
        const body = await readJson(req);
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(body));
    }
    res.writeHead(404);
    res.end();
});

server.listen(PORT);
