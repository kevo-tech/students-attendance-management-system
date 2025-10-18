export const STORAGE_KEY = 'attendanceRecords'

export function getRecords(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }catch(e){
    console.error('failed to read records', e)
    return []
  }
}

export function clearRecords(){
  localStorage.removeItem(STORAGE_KEY)
}

import type { AttendanceRecord } from '../types'

export function addRecord(r: AttendanceRecord){
  const arr = getRecords();
  arr.push(r)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
}
