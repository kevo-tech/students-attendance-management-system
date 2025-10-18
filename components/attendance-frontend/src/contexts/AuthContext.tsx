import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import type { AuthUser } from '../types'

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('token')
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  async function login(email: string, password: string) {
    try {
      const res = await api.post('/auth/login', { email, password })
      const data = res.data
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
    } catch (err) {
      // local-dev fallback
      if (email === 'lecturer@example.com') {
        const mockUser: AuthUser = { id: 'u1', name: 'Lecturer', role: 'lecturer', email }
        setUser(mockUser)
        setToken('mock-token')
        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.setItem('token', 'mock-token')
      } else if (email === 'student@example.com') {
        const mockUser: AuthUser = { id: 's1', name: 'Student', role: 'student', email }
        setUser(mockUser)
        setToken('mock-token')
        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.setItem('token', 'mock-token')
      } else {
        throw err
      }
    }
  }

  function logout() {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
