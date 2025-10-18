import axios from 'axios'

// Use Vite env var (VITE_API_URL) in client code
const base = (import.meta as any)?.env?.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: base,
  timeout: 10000,
})

export default api
