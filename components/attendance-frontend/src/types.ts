export type Role = 'lecturer' | 'student'

export type AuthUser = {
  id: string
  name: string
  role: Role
  email: string
}

export type Course = {
  id: string
  code: string
  title: string
  enrolled: number
}

export type Student = {
  id: string
  name: string
  regNo: string
  present?: boolean
}

export type AttendanceData = {
  labels: string[]
  data: number[]
}

export type AttendanceRecord = {
  id: string
  name: string
  regNo: string
  status: 'present' | 'absent'
  ts: string
}
