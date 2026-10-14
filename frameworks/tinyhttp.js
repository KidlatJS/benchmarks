import { App } from '@tinyhttp/app';
import { json } from 'milliparsec';
import { PORT } from './_harness.js';

const app = new App({ settings: { xPoweredBy: false } });

app.get('/', (req, res) => res.json({ hello: 'world' }));
app.get('/user/:id', (req, res) => res.json({ id: req.params.id }));
app.post('/echo', json(), (req, res) => res.json(req.body));

app.listen(PORT);
