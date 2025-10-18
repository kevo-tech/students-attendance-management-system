import React from 'react'
import Header from '../components/Header'
import AttendanceChart from '../components/AttendanceChart'
import { mockAttendance } from '../data/mockData'

export default function StudentDashboard(){
  return (
    <div>
      <Header />
      <main className="dashboard">
        <section>
          <h2>Your Attendance</h2>
          <AttendanceChart data={mockAttendance} />
        </section>
      </main>
    </div>
  )
}
