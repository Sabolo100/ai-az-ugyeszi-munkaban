import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../out');
const { basePath } = JSON.parse(await readFile(path.join(root, 'build-info.json'), 'utf8'));
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml' };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === basePath) {
      res.writeHead(308, { Location: `${basePath}/${url.search}` }).end();
      return;
    }
    if (!pathname.startsWith(basePath + '/')) throw new Error('Not found');
    let file = path.resolve(root, '.' + pathname.slice(basePath.length));
    if (file !== root && !file.startsWith(root + path.sep)) throw new Error('Not found');
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(308, { Location: `${pathname}/${url.search}` }).end();
        return;
      }
      file = path.join(file, 'index.html');
    }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(path.join(root, '404.html')));
  }
});
server.listen(4173, '127.0.0.1', () => console.log(`Pages preview: http://127.0.0.1:4173${basePath}/`));
