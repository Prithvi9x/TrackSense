import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExpenses } from '../hooks/useExpenses'
import ExpenseForm from '../components/ExpenseForm'

export default function AddExpense() {
  const navigate = useNavigate()
  const { addExpense } = useExpenses()
  const [justAdded, setJustAdded] = useState(false)

  async function handleSubmit(values) {
    await addExpense(values)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 font-serif text-[24px] text-ink">Add expense</h1>

      {justAdded && (
        <div className="mb-5 rounded border border-pine-100 bg-pine-50 px-4 py-2.5 text-[13px] text-pine-600">
          Expense saved. Add another, or head to{' '}
          <button className="underline" onClick={() => navigate('/history')}>
            history
          </button>
          .
        </div>
      )}

      <ExpenseForm onSubmit={handleSubmit} submitLabel="Save expense" />
    </div>
  )
}
