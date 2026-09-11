import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CATEGORY_COLORS, categoryLabel, formatINR } from '../utils/constants'

export default function CategoryDonutChart({ expenses }) {
  const data = useMemo(() => {
    const totals = {}
    for (const e of expenses) {
      const key = categoryLabel(e)
      const colorKey = e.category // color by base category, not custom label
      totals[key] = totals[key] || { name: key, value: 0, color: CATEGORY_COLORS[colorKey] || CATEGORY_COLORS.Other }
      totals[key].value += Number(e.amount)
    }
    return Object.values(totals).sort((a, b) => b.value - a.value)
  }, [expenses])

  if (data.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="h-[180px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatINR(value)}
              contentStyle={{
                borderRadius: 6,
                border: '1px solid #E5E1D8',
                fontSize: 13,
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex w-full flex-col gap-2">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center justify-between text-[13px]">
            <span className="flex items-center gap-2 text-ink-muted">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="tabular font-medium text-ink">{formatINR(entry.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex h-[180px] items-center justify-center text-[13px] text-ink-faint">
      No expenses in this period yet.
    </div>
  )
}
