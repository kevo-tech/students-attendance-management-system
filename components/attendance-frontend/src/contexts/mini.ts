import { AuthProvider, useAuth } from './AuthContext2'

export const ok = typeof AuthProvider === 'function' && typeof useAuth === 'function'

export default ok
