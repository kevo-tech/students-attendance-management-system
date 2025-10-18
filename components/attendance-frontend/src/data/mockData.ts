import type { Course, Student, AttendanceData } from '../types'

export const mockCourses: Course[] = [
  { id: 'c1', code: 'CS101', title: 'Intro to CS', enrolled: 120 },
  { id: 'c2', code: 'CS201', title: 'Data Structures', enrolled: 80 },
]

export const mockStudents: Student[] = [
  { id: 's1', name: 'Alice Johnson', regNo: '2023-001' },
  { id: 's2', name: 'Bob Smith', regNo: '2023-002' },
  { id: 's3', name: 'Carlos Diaz', regNo: '2023-003' },
]

export const mockAttendance: AttendanceData = {
  labels: ['Mon','Tue','Wed','Thu','Fri'],
  data: [85,88,90,87,89]
}
