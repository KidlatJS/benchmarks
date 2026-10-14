import Koa from 'koa';
import Router from '@koa/router';
import { bodyParser } from '@koa/bodyparser';
import { PORT } from './_harness.js';

const app = new Koa();
const router = new Router();

router.get('/', (ctx) => { ctx.body = { hello: 'world' }; });
router.get('/user/:id', (ctx) => { ctx.body = { id: ctx.params.id }; });
router.post('/echo', bodyParser(), (ctx) => { ctx.body = ctx.request.body; });

app.use(router.routes());
app.listen(PORT);
