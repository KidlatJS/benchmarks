import uWS from 'uWebSockets.js';
import { PORT } from './_harness.js';

function send(res, obj) {
    res.cork(() => {
        res.writeHeader('content-type', 'application/json; charset=utf-8').end(JSON.stringify(obj));
    });
}

uWS.App()
    .get('/', (res) => send(res, { hello: 'world' }))
    .get('/user/:id', (res, req) => send(res, { id: req.getParameter(0) }))
    .post('/echo', (res) => {
        const chunks = [];
        res.onAborted(() => { res.aborted = true; });
        res.onData((ab, isLast) => {
            chunks.push(Buffer.from(ab.slice(0)));
            if (isLast && !res.aborted) send(res, JSON.parse(Buffer.concat(chunks).toString('utf8')));
        });
    })
    .listen(PORT, () => {});
