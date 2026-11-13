// HOZGO static site server. Plain Node, no packages.
// Serves the files in this folder, falls back to index.html, refuses path climbing,
// and listens on process.env.PORT (Railway sets this) bound to 0.0.0.0.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf'
};

// Files that must never be served, even though they sit in the folder.
const PRIVATE = new Set(['server.js', 'package.json', 'CLAUDE.md', 'ideal-customer.md', 'offer.md', '.railwayignore']);

function send(res, status, type, body) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  res.end(body);
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = TYPES[ext];
  if (!type) return false;
  let body;
  try { body = fs.readFileSync(filePath); } catch (e) { return false; }
  send(res, 200, type, body);
  return true;
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (e) {
    return send(res, 400, 'text/plain; charset=utf-8', 'Bad request');
  }
  if (pathname === '/') pathname = '/index.html';

  // Refuse anything that tries to climb out of the folder or reach hidden files.
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(ROOT, safePath);
  const relative = path.relative(ROOT, filePath);
  const base = path.basename(filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative) || base.startsWith('.') || PRIVATE.has(base) || base.endsWith('.md')) {
    return serveFile(res, path.join(ROOT, 'index.html')) || send(res, 404, 'text/plain; charset=utf-8', 'Not found');
  }

  // Serve the file if it exists and is a known type, otherwise fall back to index.html.
  let isFile = false;
  try { isFile = fs.statSync(filePath).isFile(); } catch (e) { isFile = false; }
  if (isFile && serveFile(res, filePath)) return;
  if (!serveFile(res, path.join(ROOT, 'index.html'))) {
    send(res, 404, 'text/plain; charset=utf-8', 'Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('HOZGO site listening on port ' + PORT);
});
