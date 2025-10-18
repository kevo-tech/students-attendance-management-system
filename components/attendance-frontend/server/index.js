// Lightweight attendance API server using Node core http (no external deps)
const http = require('http')
const url = require('url')

const PORT = process.env.PORT || 4000
const DIST_DIR = process.env.DIST_DIR || require('path').resolve(__dirname, '..', 'dist')
let records = []
let clients = [] // SSE clients

function sendSSE(data){
  const payload = `data: ${JSON.stringify(data)}\n\n`
  clients.forEach(res => {
    try{ res.write(payload) }catch(e){/* ignore */}
  })
}

const server = http.createServer((req, res) => {
  const u = url.parse(req.url, true)
  // serve static assets from configured dist dir when available (production integration)
  const fs = require('fs')
  const path = require('path')
  const distDir = DIST_DIR
  const isApi = u.pathname && u.pathname.startsWith('/api/')
  if(!isApi){
    // try to serve static file from dist
    let filePath = path.join(distDir, u.pathname === '/' ? 'index.html' : u.pathname)
    if(fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()){
      filePath = path.join(filePath, 'index.html')
    }
    if(fs.existsSync(filePath)){
      const stream = fs.createReadStream(filePath)
      const ext = path.extname(filePath).toLowerCase()
      const contentType = {
        '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml'
      }[ext] || 'application/octet-stream'
      res.writeHead(200, {'Content-Type': contentType})
      stream.pipe(res)
      return
    }
    // if no static file, fall through to API 404 below or serve index.html if SPA
    const indexPath = path.join(distDir, 'index.html')
    if(fs.existsSync(indexPath)){
      res.writeHead(200, {'Content-Type':'text/html'})
      fs.createReadStream(indexPath).pipe(res)
      return
    }
  }
  // basic CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if(req.method === 'OPTIONS'){
    res.writeHead(204)
    return res.end()
  }

  if(u.pathname === '/api/attendance' && req.method === 'POST'){
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try{
        const obj = JSON.parse(body)
        // basic validation
        if(!obj || typeof obj !== 'object') throw new Error('invalid json')
        const missing = []
        if(!obj.name) missing.push('name')
        if(!obj.regNo) missing.push('regNo')
        if(!obj.session || !obj.session.sessionId) missing.push('session.sessionId')
        if(missing.length){
          res.writeHead(400, {'Content-Type':'application/json'})
          return res.end(JSON.stringify({ error: 'missing fields', missing }))
        }
        const rec = Object.assign({}, obj, { id: Date.now().toString(36), ts: new Date().toISOString() })
        records.push(rec)
        // notify SSE clients
        sendSSE(rec)
        res.writeHead(201, {'Content-Type':'application/json'})
        res.end(JSON.stringify(rec))
      }catch(err){
        res.writeHead(400, {'Content-Type':'application/json'})
        res.end(JSON.stringify({ error: err.message || 'invalid json' }))
      }
    })
    return
  }

  if(u.pathname === '/api/attendance' && req.method === 'GET'){
    res.writeHead(200, {'Content-Type':'application/json'})
    res.end(JSON.stringify(records))
    return
  }

  if(u.pathname === '/api/stream' && req.method === 'GET'){
    // SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    })
    res.write(': connected\n\n')
    // send existing records as an initial event
    if(records.length) res.write(`data: ${JSON.stringify(records)}\n\n`)
    clients.push(res)
    req.on('close', () => {
      clients = clients.filter(r => r !== res)
    })
    return
  }

  // fallback
  res.writeHead(404)
  res.end('Not found')
})

// Bind to 0.0.0.0 so the server is reachable from other devices on the LAN
server.listen(PORT, '0.0.0.0', ()=>{
  console.log(`Attendance API server listening on http://0.0.0.0:${PORT}`)
  // print likely LAN addresses to help connecting from phone
  try{
    const os = require('os')
    const ifaces = os.networkInterfaces()
    Object.keys(ifaces).forEach(name => {
      for(const iface of ifaces[name]){
        if(iface.family === 'IPv4' && !iface.internal){
          console.log(`Network address: http://${iface.address}:${PORT}/`)
        }
      }
    })
  }catch(e){/* ignore */}
})
