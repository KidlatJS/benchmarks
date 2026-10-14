import express from 'express';
import { PORT } from './_harness.js';

const app = express();
app.disable('etag');
app.disable('x-powered-by');

app.get('/', (req, res) => res.json({ hello: 'world' }));
app.get('/user/:id', (req, res) => res.json({ id: req.params.id }));
app.post('/echo', express.json(), (req, res) => res.json(req.body));

app.listen(PORT);
