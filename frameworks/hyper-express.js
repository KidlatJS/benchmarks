import HyperExpress from 'hyper-express';
import { PORT } from './_harness.js';

const app = new HyperExpress.Server();

app.get('/', (req, res) => res.json({ hello: 'world' }));
app.get('/user/:id', (req, res) => res.json({ id: req.path_parameters.id }));
app.post('/echo', async (req, res) => res.json(await req.json()));

await app.listen(PORT);
