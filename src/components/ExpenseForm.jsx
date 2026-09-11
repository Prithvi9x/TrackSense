import React, { useState } from 'react'
import { CATEGORIES, PAYMENT_METHODS } from '../utils/constants'
import { todayStr } from '../utils/dateRanges'

const emptyForm = {
  amount: '',
  category: 'Bus',
  custom_category: '',
  date: todayStr(),
  payment_method: 'UPI',
  custom_payment_method: '',
}

export default function ExpenseForm({ initial, onSubmit, onCancel, submitLabel = 'Save expense' }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...initial,
    custom_category: initial?.custom_category ?? '',
    custom_payment_method: initial?.custom_payment_method ?? '',
  }))
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const amountNum = Number(form.amount)
    if (!amountNum || amountNum <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }
    if (form.category === 'Other' && !form.custom_category.trim()) {
      setError('Enter a name for the custom category.')
      return
    }
    if (form.payment_method === 'Other' && !form.custom_payment_method.trim()) {
      setError('Enter a name for the custom payment method.')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
        amount: amountNum,
        category: form.category,
        custom_category: form.category === 'Other' ? form.custom_category.trim() : null,
        date: form.date,
        payment_method: form.payment_method,
        custom_payment_method:
          form.payment_method === 'Other' ? form.custom_payment_method.trim() : null,
      })
      // Reset for the next entry (form stays mounted after a successful add).
      setForm({ ...emptyForm, ...initial })
    } catch (err) {
      setError(err.message || 'Could not save expense.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="label" htmlFor="amount">Amount</label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-ink-faint">
            ₹
          </span>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            required
            autoFocus
            placeholder="0.00"
            className="field !pl-9 text-[17px] tabular"
            value={form.amount}
            onChange={(e) => set('amount', e.target.value)}
          />
        </div>
      </div>

      <div>
        <span className="label">Category</span>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => set('category', cat)}
              className={`rounded border px-3 py-2 text-[13px] font-medium transition-colors ${
                form.category === cat
                  ? 'border-pine-500 bg-pine-50 text-pine-600'
                  : 'border-line bg-surface text-ink-muted hover:bg-pine-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {form.category === 'Other' && (
          <input
            type="text"
            placeholder="Custom category, e.g. Movie"
            className="field mt-2"
            value={form.custom_category}
            onChange={(e) => set('custom_category', e.target.value)}
          />
        )}
      </div>

      <div>
        <label className="label" htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          required
          className="field"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
        />
      </div>

      <div>
        <span className="label">Payment method</span>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_METHODS.map((pm) => (
            <button
              type="button"
              key={pm}
              onClick={() => set('payment_method', pm)}
              className={`rounded border px-3 py-2 text-[13px] font-medium transition-colors ${
                form.payment_method === pm
                  ? 'border-pine-500 bg-pine-50 text-pine-600'
                  : 'border-line bg-surface text-ink-muted hover:bg-pine-50'
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
        {form.payment_method === 'Other' && (
          <input
            type="text"
            placeholder="Custom payment method, e.g. Credit Card"
            className="field mt-2"
            value={form.custom_payment_method}
            onChange={(e) => set('custom_payment_method', e.target.value)}
          />
        )}
      </div>

      {error && <p className="text-[13px] text-rust-500">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button type="submit" className="btn-primary flex-1" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}