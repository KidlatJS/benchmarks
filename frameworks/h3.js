import { H3, serve } from 'h3';
import { PORT } from './_harness.js';

const app = new H3();

app.get('/', () => ({ hello: 'world' }));
app.get('/user/:id', (event) => ({ id: event.context.params.id }));
app.post('/echo', (event) => event.req.json());

serve(app, { port: PORT, silent: true });
