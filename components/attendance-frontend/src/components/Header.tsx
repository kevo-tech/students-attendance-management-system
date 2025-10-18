import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts'

export default function Header(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="app-header">
      <div className="brand" onClick={()=> navigate(user?.role === 'lecturer' ? '/lecturer' : '/student')}>AttendanceApp</div>
      <div className="header-right">
        <div className="user">{user?.name}</div>
        <button onClick={()=>{ logout(); navigate('/login') }}>Sign out</button>
      </div>
    </header>
  )
}
