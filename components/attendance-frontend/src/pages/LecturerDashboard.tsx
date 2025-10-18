import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import StudentsTable from '../components/StudentsTable'
import AttendanceChart from '../components/AttendanceChart'
import { getRecords as getLocalRecords, clearRecords as clearLocalRecords } from '../services/localAttendance'
import type { AttendanceRecord } from '../types'

export default function LecturerDashboard(){
  const [records, setRecords] = useState<AttendanceRecord[]>([])

  // load from API first, otherwise fallback to localStorage
  useEffect(()=>{
    // use relative API paths so frontend and backend can be served from the same origin
    const apiHost = ''

    let es: EventSource | null = null
    let pollId: number | null = null
    let reconnectTimer: number | null = null

    const dedupeAndAppend = (incoming: AttendanceRecord | AttendanceRecord[]) => {
      setRecords(prev => {
        const list = Array.isArray(incoming) ? incoming : [incoming]
        const byId = new Map(prev.map(r => [r.id, r]))
        for(const it of list){
          if(!byId.has(it.id)) byId.set(it.id, it)
        }
        // preserve ordering: existing then new (by timestamp)
        return Array.from(byId.values()).sort((a,b)=> new Date(a.ts).getTime() - new Date(b.ts).getTime())
      })
    }

    const connectSSE = () => {
      try{
  es = new EventSource('/api/stream')
        es.onmessage = (ev) => {
          try{
            const payload = JSON.parse(ev.data)
            dedupeAndAppend(payload)
          }catch(e){ console.error('SSE parse error', e) }
        }
        es.onerror = (e) => {
          console.warn('SSE error, will attempt reconnect', e)
          try{ es?.close() }catch(_){}
          es = null
          if(reconnectTimer) window.clearTimeout(reconnectTimer)
          reconnectTimer = window.setTimeout(()=>{
            connectSSE()
          }, 3000)
        }
      }catch(e){
        console.warn('SSE subscribe failed', e)
      }
    }

    ;(async ()=>{
      try{
  const res = await fetch('/api/attendance')
        if(!res.ok) throw new Error('no api')
        const data: AttendanceRecord[] = await res.json()
        setRecords(data || [])
        connectSSE()
      }catch(err){
        console.warn('API not reachable, falling back to localStorage', err)
        setRecords(getLocalRecords())
        // as a fallback, poll localStorage
        pollId = window.setInterval(()=> setRecords(getLocalRecords()), 2000)
      }
    })()

    return ()=>{
      if(es) try{ es.close() }catch(_){}
      if(pollId) clearInterval(pollId)
      if(reconnectTimer) clearTimeout(reconnectTimer)
    }
  }, [])

  const present = records.filter(r=> r.status === 'present').length
  const absent = records.filter(r=> r.status === 'absent').length

  return (
    <div>
      <Header />
      <main className="dashboard">
        <section className="dashboard-left">
          <h2>Student submissions</h2>
          <p>Total submissions: {records.length} — Present: {present} — Absent: {absent}</p>
          <ul>
            {records.map(r => (
              <li key={r.id}>{r.name} ({r.regNo}) — {r.status} @ {new Date(r.ts).toLocaleTimeString()}</li>
            ))}
          </ul>
          <div style={{marginTop:12}}>
            <button onClick={()=>{ clearLocalRecords(); setRecords([]) }}>Clear records</button>
          </div>
        </section>
        <section className="dashboard-right">
          <h2>Attendance</h2>
          <AttendanceChart data={{ labels: ['Present','Absent'], data: [present, absent] }} />
        </section>
      </main>
    </div>
  )
}
