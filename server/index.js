require('./schedule')
const { createServer } = require('http')
const { parse } = require('url')
const path = require('path')
const next = require('next')
const read = require('./read')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl

    if (pathname === '/api/ping') {
      read.ping().then((data) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(data));
        res.end();
      });
    } else if (pathname === '/api/speedtest') {
      read.speedtest().then((data) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(data));
        res.end();
      });
    } else if (pathname === '/favicon.ico') {
      app.serveStatic(req, res, path.resolve(__dirname + '/../static/favicon.ico'));
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(process.env.PORT || 8080, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
