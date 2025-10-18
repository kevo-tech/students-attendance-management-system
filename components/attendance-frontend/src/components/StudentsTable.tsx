import React, { useState } from 'react'
import type { Student } from '../types'

export default function StudentsTable({ students }: { students: Student[] }){
  const [list, setList] = useState<Student[]>(students)

  React.useEffect(()=> setList(students), [students])

  function togglePresent(id: string){
    setList(prev => prev.map(s => s.id === id ? { ...s, present: !s.present } : s))
  }

  return (
    <table className="students-table">
      <thead>
        <tr><th>#</th><th>Name</th><th>Reg No</th><th>Present</th></tr>
      </thead>
      <tbody>
        {list.map((s, i) => (
          <tr key={s.id}>
            <td>{i+1}</td>
            <td>{s.name}</td>
            <td>{s.regNo}</td>
            <td>
              <input type="checkbox" checked={!!s.present} onChange={()=>togglePresent(s.id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
