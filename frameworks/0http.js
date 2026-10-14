import zero from '0http';
import { PORT, readJson } from './_harness.js';

const { router, server } = zero();

function send(res, obj) {
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(obj));
}

router.get('/', (req, res) => send(res, { hello: 'world' }));
router.get('/user/:id', (req, res) => send(res, { id: req.params.id }));
router.post('/echo', async (req, res) => send(res, await readJson(req)));

server.listen(PORT);
