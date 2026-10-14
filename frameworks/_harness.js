/** Shared by every server under frameworks/. It never touches the request path:
*   it only reads the port and answers the runner's resource-usage queries over IPC. 
*/
export const PORT = Number(process.env.PORT) || 3000;

if (process.send) {
    process.on('message', (msg) => {
        if (msg === 'usage') {
            process.send({ cpu: process.cpuUsage(), rss: process.memoryUsage().rss });
        }
    });
}

// Read a request body from a Node IncomingMessage
export function readJson(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', () => {
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}
