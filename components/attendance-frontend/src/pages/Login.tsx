import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function submit(e: React.FormEvent){
    e.preventDefault()
    try{
      await login(email, password)
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      if (user?.role === 'lecturer') navigate('/lecturer')
      else navigate('/student')
    }catch(err){
      setError('Login failed. Use lecturer@example.com or student@example.com for local dev')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submit}>
        <h2>Sign in</h2>
        {error && <div className="error">{error}</div>}
        <label>
          Username
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="lecturer@example.com" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        <div className="auth-actions">
          <button type="submit" className="primary">Log in</button>
          <button type="button" className="secondary" onClick={()=>{/* placeholder for signup flow */}}>Sign up</button>
        </div>
      </form>
    </div>
  )
}
