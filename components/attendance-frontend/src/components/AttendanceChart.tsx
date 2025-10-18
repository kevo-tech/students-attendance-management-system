import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function AttendanceChart({ data }: { data: { labels: string[]; data: number[] } }){
  const chartData = {
    labels: data.labels,
    datasets: [
      { label: 'Attendance %', data: data.data, borderColor: '#1d4ed8', backgroundColor: 'rgba(29,78,216,0.1)', tension: 0.3 }
    ]
  }

  return <Line data={chartData} />
}
