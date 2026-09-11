import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useExpenses } from '../hooks/useExpenses'
import { getRangeForPeriod, periodLabel, todayStr, toLocalDateStr } from '../utils/dateRanges'
import { categoryLabel, formatINR, paymentLabel } from '../utils/constants'
import CategoryDonutChart from '../components/CategoryDonutChart'
import SpendingOverTimeChart from '../components/SpendingOverTimeChart'

const PERIODS = ['today', 'week', 'month', 'custom']

export default function Dashboard() {
  const [period, setPeriod] = useState('month')
  const [customRange, setCustomRange] = useState({ start: todayStr(), end: todayStr() })

  // A rolling month window is enough to derive today / week / month stats
  // client-side, since each is a subset of the current month.
  const monthRange = getRangeForPeriod('month')
  const { expenses: monthExpenses, loading: statsLoading } = useExpenses(monthRange)

  const stats = useMemo(() => {
    const today = todayStr()
    const weekRange = getRangeForPeriod('week')

    const sum = (list) => list.reduce((acc, e) => acc + Number(e.amount), 0)

    const todayExpenses = monthExpenses.filter((e) => e.date === today)
    const weekExpenses = monthExpenses.filter((e) => e.date >= weekRange.start && e.date <= weekRange.end)

    const byCategory = {}
    for (const e of monthExpenses) {
      const key = categoryLabel(e)
      byCategory[key] = (byCategory[key] || 0) + Number(e.amount)
    }
    const highest = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]

    return {
      today: sum(todayExpenses),
      week: sum(weekExpenses),
      month: sum(monthExpenses),
      count: monthExpenses.length,
      highestCategory: highest ? highest[0] : '—',
    }
  }, [monthExpenses])

  const selectedRange = period === 'custom' ? customRange : getRangeForPeriod(period)
  const { expenses: periodExpenses, loading: chartLoading } = useExpenses(selectedRange)

  const recent = monthExpenses.slice(0, 6)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-[24px] text-ink">Overview</h1>
        <Link to="/add" className="btn-primary hidden sm:inline-flex">
          Add expense
        </Link>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-md border border-line bg-surface px-5 py-5 sm:grid-cols-4">
        <Stat label="Today" value={formatINR(stats.today)} loading={statsLoading} />
        <Stat label="This week" value={formatINR(stats.week)} loading={statsLoading} />
        <Stat label="This month" value={formatINR(stats.month)} loading={statsLoading} />
        <Stat label="Expenses this month" value={String(stats.count)} loading={statsLoading} plain />
      </div>

      <div className="flex items-center gap-2 text-[13px] text-ink-muted">
        <span>Highest category this month:</span>
        <span className="font-medium text-ink">{stats.highestCategory}</span>
      </div>

      {/* Period switcher */}
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded px-3 py-1.5 text-[13px] font-medium transition-colors ${
                period === p ? 'bg-pine-500 text-white' : 'bg-pine-50 text-ink-muted hover:text-ink'
              }`}
            >
              {periodLabel(p)}
            </button>
          ))}
          {period === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="field w-auto py-1.5 text-[13px]"
                value={customRange.start}
                max={customRange.end}
                onChange={(e) => setCustomRange((r) => ({ ...r, start: e.target.value }))}
              />
              <span className="text-ink-faint">to</span>
              <input
                type="date"
                className="field w-auto py-1.5 text-[13px]"
                value={customRange.end}
                min={customRange.start}
                max={toLocalDateStr(new Date())}
                onChange={(e) => setCustomRange((r) => ({ ...r, end: e.target.value }))}
              />
            </div>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-md border border-line bg-surface p-5">
            <h2 className="mb-4 text-[13px] font-medium text-ink-muted">
              By category — {periodLabel(period).toLowerCase()}
            </h2>
            {chartLoading ? (
              <ChartSkeleton />
            ) : (
              <CategoryDonutChart expenses={periodExpenses} />
            )}
          </div>
          <div className="rounded-md border border-line bg-surface p-5">
            <h2 className="mb-4 text-[13px] font-medium text-ink-muted">
              Over time — {periodLabel(period).toLowerCase()}
            </h2>
            {chartLoading ? <ChartSkeleton /> : <SpendingOverTimeChart expenses={periodExpenses} />}
          </div>
        </div>
      </div>

      {/* Recent expenses */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-medium text-ink-muted">Recent expenses</h2>
          <Link to="/history" className="text-[13px] font-medium text-pine-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-md border border-line bg-surface">
          {recent.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-ink-faint">
              No expenses yet. Add your first one.
            </p>
          ) : (
            recent.map((e, i) => (
              <div
                key={e.id}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i !== recent.length - 1 ? 'border-b border-line' : ''
                }`}
              >
                <div>
                  <p className="text-[14px] text-ink">{categoryLabel(e)}</p>
                  <p className="text-[12px] text-ink-faint">
                    {formatDate(e.date)} · {paymentLabel(e)}
                  </p>
                </div>
                <span className="tabular text-[14px] font-medium text-ink">{formatINR(e.amount)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile floating add button */}
      <Link
        to="/add"
        className="fixed bottom-20 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-pine-500 text-white shadow-lg sm:hidden"
        aria-label="Add expense"
      >
        <span className="text-2xl leading-none">+</span>
      </Link>
    </div>
  )
}

function Stat({ label, value, loading, plain }) {
  return (
    <div>
      <p className="text-[12px] text-ink-faint">{label}</p>
      <p className={`mt-1 tabular ${plain ? 'text-[20px]' : 'font-serif text-[22px]'} text-ink`}>
        {loading ? '—' : value}
      </p>
    </div>
  )
}

function ChartSkeleton() {
  return <div className="h-[180px] animate-pulse rounded bg-pine-50" />
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
