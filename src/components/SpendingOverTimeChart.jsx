import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatINR } from '../utils/constants'

export default function SpendingOverTimeChart({ expenses }) {
  const data = useMemo(() => {
    const totals = {}
    for (const e of expenses) {
      totals[e.date] = (totals[e.date] || 0) + Number(e.amount)
    }
    return Object.entries(totals)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, amount]) => ({
        date,
        amount,
        label: formatShortDate(date),
      }))
  }, [expenses])

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-[13px] text-ink-faint">
        No expenses in this period yet.
      </div>
    )
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#E5E1D8" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#9A9DA3' }}
            axisLine={{ stroke: '#E5E1D8' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9A9DA3' }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip
            formatter={(value) => formatINR(value)}
            labelFormatter={(label) => label}
            contentStyle={{
              borderRadius: 6,
              border: '1px solid #E5E1D8',
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <Bar dataKey="amount" fill="#2F5D50" radius={[3, 3, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
