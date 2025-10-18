const http = require('http');

function post(rec){
  return new Promise((res,rej)=>{
    const data = JSON.stringify(rec)
    const req = http.request({ hostname: 'localhost', port: 4000, path: '/api/attendance', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, r=>{
      let body = ''
      r.on('data', c=> body += c)
      r.on('end', ()=> res({ statusCode: r.statusCode, body }))
    })
    req.on('error', rej)
    req.write(data)
    req.end()
  })
}

function getAll(){
  return new Promise((res,rej)=>{
    http.get('http://localhost:4000/api/attendance', r=>{
      let b = ''
      r.on('data', c=> b += c)
      r.on('end', ()=> res(b))
    }).on('error', rej)
  })
}

;(async()=>{
  try{
    const p = await post({ name: 'Scripted Test Student', regNo: 'SCRPT123', status: 'present' })
    console.log('POST:', p.statusCode, p.body)
    const all = await getAll()
    console.log('GET:', all)
  }catch(e){
    console.error('ERR', e && e.message)
    process.exitCode = 1
  }
})()
