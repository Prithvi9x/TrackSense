import React, { useMemo, useState } from 'react'
import { Pencil, Trash2, X } from 'lucide-react'
import { useExpenses } from '../hooks/useExpenses'
import ExpenseForm from '../components/ExpenseForm'
import ConfirmDialog from '../components/ConfirmDialog'
import { CATEGORIES, categoryLabel, formatINR, paymentLabel } from '../utils/constants'

export default function History() {
  const { expenses, loading, updateExpense, deleteExpense } = useExpenses()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [editing, setEditing] = useState(null) // expense object or null
  const [pendingDelete, setPendingDelete] = useState(null) // expense object or null

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (category !== 'All' && e.category !== category) return false
      if (startDate && e.date < startDate) return false
      if (endDate && e.date > endDate) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        const haystack = `${categoryLabel(e)} ${paymentLabel(e)}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [expenses, category, startDate, endDate, search])

  const total = filtered.reduce((acc, e) => acc + Number(e.amount), 0)

  async function handleEditSubmit(values) {
    await updateExpense(editing.id, values)
    setEditing(null)
  }

  async function handleDeleteConfirm() {
    await deleteExpense(pendingDelete.id)
    setPendingDelete(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-serif text-[24px] text-ink">History</h1>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="label">Search</label>
          <input
            type="text"
            placeholder="Category or payment method"
            className="field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="label">Category</label>
          <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-40">
          <label className="label">From</label>
          <input
            type="date"
            className="field"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <label className="label">To</label>
          <input
            type="date"
            className="field"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        {(search || category !== 'All' || startDate || endDate) && (
          <button
            className="btn-ghost"
            onClick={() => {
              setSearch('')
              setCategory('All')
              setStartDate('')
              setEndDate('')
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-[13px] text-ink-muted">
        <span>{filtered.length} expenses</span>
        <span>
          Total: <span className="tabular font-medium text-ink">{formatINR(total)}</span>
        </span>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-md border border-line bg-surface">
        {loading ? (
          <p className="px-5 py-10 text-center text-[13px] text-ink-faint">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-[13px] text-ink-faint">No expenses match these filters.</p>
        ) : (
          filtered.map((e, i) => (
            <div
              key={e.id}
              className={`flex items-center justify-between gap-3 px-5 py-3.5 ${
                i !== filtered.length - 1 ? 'border-b border-line' : ''
              }`}
            >
              <div className="min-w-0">
                <p className="text-[14px] text-ink">{categoryLabel(e)}</p>
                <p className="text-[12px] text-ink-faint">{formatDate(e.date)} · {paymentLabel(e)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="tabular text-[14px] font-medium text-ink">{formatINR(e.amount)}</span>
                <button
                  className="rounded p-1.5 text-ink-faint hover:bg-pine-50 hover:text-pine-600"
                  aria-label="Edit"
                  onClick={() => setEditing(e)}
                >
                  <Pencil size={15} />
                </button>
                <button
                  className="rounded p-1.5 text-ink-faint hover:bg-rust-500/10 hover:text-rust-500"
                  aria-label="Delete"
                  onClick={() => setPendingDelete(e)}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit panel */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-md border border-line bg-surface p-5 sm:rounded-md">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-[20px] text-ink">Edit expense</h2>
              <button className="rounded p-1 text-ink-faint hover:bg-pine-50" onClick={() => setEditing(null)}>
                <X size={18} />
              </button>
            </div>
            <ExpenseForm
              initial={editing}
              submitLabel="Save changes"
              onSubmit={handleEditSubmit}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this expense?"
        description={pendingDelete ? `${categoryLabel(pendingDelete)} · ${formatINR(pendingDelete.amount)} on ${formatDate(pendingDelete.date)}` : ''}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
