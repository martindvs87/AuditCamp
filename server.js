const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const pages = require('./pages');

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (e) {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(html);
  }

  const parsed = url.parse(req.url, true);
  const parts = parsed.pathname.split('/').filter(Boolean);
  if (parts.length < 2) {
    res.writeHead(404);
    return res.end('Not found');
  }
  const [category, resource, id] = parts;
  if (resource !== 'pages') {
    res.writeHead(404);
    return res.end('Not found');
  }

  try {
    if (req.method === 'GET' && !id) {
      return sendJson(res, 200, pages.listPages(category));
    }
    if (req.method === 'GET' && id) {
      const page = pages.getPage(category, Number(id));
      if (page) return sendJson(res, 200, page);
      return sendJson(res, 404, { error: 'Not found' });
    }
    if (req.method === 'POST') {
      const body = await parseBody(req);
      const page = pages.createPage(category, body.title, body.body);
      return sendJson(res, 201, page);
    }
    if (req.method === 'PUT' && id) {
      const body = await parseBody(req);
      const page = pages.updatePage(category, Number(id), body.title, body.body);
      if (page) return sendJson(res, 200, page);
      return sendJson(res, 404, { error: 'Not found' });
    }
    if (req.method === 'DELETE' && id) {
      const ok = pages.deletePage(category, Number(id));
      if (ok) return sendJson(res, 204, {});
      return sendJson(res, 404, { error: 'Not found' });
    }
    res.writeHead(405);
    res.end('Method not allowed');
  } catch (e) {
    res.writeHead(500);
    res.end(e.message);
  }
});

if (require.main === module) {
  server.listen(3000, () => console.log('Server running on port 3000'));
}

module.exports = server;
