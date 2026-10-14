import restify from 'restify';
import { PORT } from './_harness.js';

const server = restify.createServer();

server.get('/', (req, res, next) => { res.send({ hello: 'world' }); next(); });
server.get('/user/:id', (req, res, next) => { res.send({ id: req.params.id }); next(); });
server.post('/echo', restify.plugins.bodyParser(), (req, res, next) => { res.send(req.body); next(); });

server.listen(PORT);
