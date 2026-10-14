import { Kidlat } from 'kidlat';
import { PORT } from './_harness.js';

const app = new Kidlat({ logger: false });

app.get('/', (req, res) => res.json({ hello: 'world' }));
app.get('/user/:id', (req, res) => res.json({ id: req.params.id }));
app.post('/echo', async (req, res) => res.json(await req.json()));

app.listen(PORT);
