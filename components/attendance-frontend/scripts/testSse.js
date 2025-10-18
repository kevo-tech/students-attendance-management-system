const http = require('http')

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

function listenSSE(){
  return new Promise((res,rej)=>{
    const req = http.request({ hostname: 'localhost', port: 4000, path: '/api/stream', method: 'GET' }, r=>{
      r.on('data', chunk => {
        const s = chunk.toString()
        console.log('SSE CHUNK:', s)
        if(s.includes('Scripted Test Student') || s.includes('Core Node Test') || s.includes('Automated Test Student') || s.includes('Scripted')){
          res(s)
        }
      })
      r.on('end', ()=> rej(new Error('SSE ended')))
    })
    req.on('error', rej)
    req.end()
  })
}

;(async()=>{
  try{
    console.log('Listening to SSE...')
    const ssePromise = listenSSE()
    console.log('Posting a new record...')
    const p = await post({ name: 'SSE Test Student', regNo: 'SSE123', status: 'present' })
    console.log('POST result:', p.statusCode)
    const sseData = await Promise.race([ssePromise, new Promise((res)=> setTimeout(()=> res('TIMEOUT'), 4000))])
    console.log('SSE result (or timeout):', sseData)
  }catch(e){
    console.error('ERR', e && e.message)
  }
})()
