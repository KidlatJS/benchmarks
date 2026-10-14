import Hapi from '@hapi/hapi';
import { PORT } from './_harness.js';

const server = Hapi.server({ port: PORT, host: '127.0.0.1', debug: false });

server.route({ method: 'GET', path: '/', handler: () => ({ hello: 'world' }) });
server.route({ method: 'GET', path: '/user/{id}', handler: (req) => ({ id: req.params.id }) });
server.route({ method: 'POST', path: '/echo', handler: (req) => req.payload });

await server.start();
