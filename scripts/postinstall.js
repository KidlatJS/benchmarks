#!/usr/bin/env node
/** Fixes a broken uWebSockets.js install where ESM_wrapper.mjs imports
*   ./index.js but the package only ships ./uws.js as its CJS entry.
*   This runs automatically after every `npm install` / `npm ci`.
*/

import { existsSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const uwsDir   = path.join(ROOT, 'node_modules', 'uWebSockets.js');
const indexJs  = path.join(uwsDir, 'index.js');
const uwsJs    = path.join(uwsDir, 'uws.js');
const wrapper  = path.join(uwsDir, 'ESM_wrapper.mjs');

// Only patch when the package is installed and the shim is missing.
if (!existsSync(uwsJs) || !existsSync(wrapper)) {
    console.log('postinstall: uWebSockets.js not found, skipping patch.');
    process.exit(0);
}

if (existsSync(indexJs)) {
    process.exit(0);
}

writeFileSync(
    indexJs,
    '// Shim created by scripts/postinstall.js\n' +
    '// ESM_wrapper.mjs imports this file, but the package only ships uws.js.\n' +
    'module.exports = require(\'./uws.js\');\n',
    'utf8'
);

console.log('postinstall: created node_modules/uWebSockets.js/index.js shim.');
