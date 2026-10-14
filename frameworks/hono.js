import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PORT } from './_harness.js';

const app = new Hono();

app.get('/', (c) => c.json({ hello: 'world' }));
app.get('/user/:id', (c) => c.json({ id: c.req.param('id') }));
app.post('/echo', async (c) => c.json(await c.req.json()));

serve({ fetch: app.fetch, port: PORT });
