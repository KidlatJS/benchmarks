import Fastify from 'fastify';
import { PORT } from './_harness.js';

const app = Fastify({ logger: false });

app.get('/', (req, reply) => reply.send({ hello: 'world' }));
app.get('/user/:id', (req, reply) => reply.send({ id: req.params.id }));
app.post('/echo', (req, reply) => reply.send(req.body));

await app.listen({ port: PORT, host: '127.0.0.1' });
