// HOZGO site server. Plain Node, no packages.
// Serves the Vite build in dist/, falls back to index.html for client-side routes,
// refuses dotfiles and path climbing, and listens on process.env.PORT (Railway sets this).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const INDEX = path.join(ROOT, 'index.html');
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf'
};

function send(res, status, type, body, cache) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': cache || 'no-cache' });
  res.end(body);
}

function serveFile(res, filePath, pathname) {
  const type = TYPES[path.extname(filePath).toLowerCase()];
  if (!type) return false;
  let body;
  try { body = fs.readFileSync(filePath); } catch (e) { return false; }
  let cache = 'public, max-age=3600';
  if (type.startsWith('text/html')) cache = 'no-cache';
  else if (pathname && pathname.startsWith('/assets/')) cache = 'public, max-age=31536000, immutable';
  send(res, 200, type, body, cache);
  return true;
}

function fallback(res) {
  if (!serveFile(res, INDEX, '/index.html')) send(res, 404, 'text/plain; charset=utf-8', 'Not found');
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'text/plain; charset=utf-8', 'Method not allowed');
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (e) {
    return send(res, 400, 'text/plain; charset=utf-8', 'Bad request');
  }
  if (pathname.indexOf('\0') !== -1) return send(res, 400, 'text/plain; charset=utf-8', 'Bad request');
  if (pathname === '/') return fallback(res);

  // Refuse dotfiles and anything that climbs out of dist/.
  const segments = pathname.split('/');
  if (segments.some(function (s) { return s === '..' || s.startsWith('.'); })) return fallback(res);
  const filePath = path.join(ROOT, path.normalize(pathname));
  const relative = path.relative(ROOT, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return fallback(res);

  let isFile = false;
  try { isFile = fs.statSync(filePath).isFile(); } catch (e) { isFile = false; }
  if (isFile && serveFile(res, filePath, pathname)) return;

  // A missing file with an extension is a real 404; anything else is a client-side route.
  if (path.extname(pathname)) return send(res, 404, 'text/plain; charset=utf-8', 'Not found');
  fallback(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('HOZGO site listening on port ' + PORT);
});
