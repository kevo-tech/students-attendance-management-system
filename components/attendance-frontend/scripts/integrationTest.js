const http = require('http')

function get(path){
  return new Promise((res,rej)=>{
    http.get({ hostname:'localhost', port:4000, path, timeout:5000 }, r=>{
      let b=''
      r.on('data', c=> b+=c)
      r.on('end', ()=> res({ statusCode: r.statusCode, body: b }))
    }).on('error', rej)
  })
}

function post(path, obj){
  return new Promise((res,rej)=>{
    const data = JSON.stringify(obj)
    const req = http.request({ hostname:'localhost', port:4000, path, method:'POST', headers:{ 'Content-Type':'application/json','Content-Length':Buffer.byteLength(data) } }, r=>{
      let b=''
      r.on('data', c=> b+=c)
      r.on('end', ()=> res({ statusCode: r.statusCode, body: b }))
    })
    req.on('error', rej)
    req.write(data)
    req.end()
  })
}

;(async ()=>{
  try{
    console.log('GET /student.html')
    const p = await get('/student.html')
    console.log('GET status', p.statusCode, 'bodyLen', p.body.length)

    console.log('POST /api/attendance')
    const pp = await post('/api/attendance', { name:'IT Test', regNo:'IT123', status:'present', ts: new Date().toISOString(), session: { sessionId:'SIT100' } })
    console.log('POST status', pp.statusCode, 'body', pp.body)

    console.log('GET /api/attendance')
    const all = await get('/api/attendance')
    console.log('GET attendance status', all.statusCode, 'body', all.body)
  }catch(e){ console.error('ERR', e && e.message) }
})()
