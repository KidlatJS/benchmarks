import polka from 'polka';
import bodyParser from 'body-parser';
import { PORT } from './_harness.js';

function send(res, obj) {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(obj));
}

polka()
    .get('/', (req, res) => send(res, { hello: 'world' }))
    .get('/user/:id', (req, res) => send(res, { id: req.params.id }))
    .post('/echo', bodyParser.json(), (req, res) => send(res, req.body))
    .listen(PORT);
