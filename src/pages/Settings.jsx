import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { downloadFile, expensesToCSV, expensesToJSON, parseImportFile } from '../utils/csv'
import { todayStr } from '../utils/dateRanges'

export default function Settings() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { expenses, bulkInsert } = useExpenses() // all expenses, no range filter
  const fileInputRef = useRef(null)

  const [importStatus, setImportStatus] = useState(null)
  const [importing, setImporting] = useState(false)

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  function handleExport(format) {
    const filename = `expenses-${todayStr()}.${format}`
    if (format === 'csv') {
      downloadFile(filename, expensesToCSV(expenses), 'text/csv')
    } else {
      downloadFile(filename, expensesToJSON(expenses), 'application/json')
    }
  }

  async function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportStatus(null)
    setImporting(true)
    try {
      const text = await file.text()
      const rows = parseImportFile(text, file.name)
      if (rows.length === 0) {
        setImportStatus({ type: 'error', message: 'No rows found in file.' })
      } else {
        await bulkInsert(rows)
        setImportStatus({ type: 'success', message: `Imported ${rows.length} expenses.` })
      }
    } catch (err) {
      setImportStatus({ type: 'error', message: err.message || 'Could not import this file.' })
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <h1 className="font-serif text-[24px] text-ink">Settings</h1>

      <Section title="Account">
        <Row label="Email" value={user?.email} />
      </Section>

      <Section title="Currency">
        <Row label="Default currency" value="Indian Rupee (₹)" />
      </Section>

      <Section title="Export expenses" description="Download a copy of all your expenses for backup.">
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={() => handleExport('csv')}>
            Export CSV
          </button>
          <button className="btn-secondary" onClick={() => handleExport('json')}>
            Export JSON
          </button>
        </div>
      </Section>

      <Section
        title="Import expenses"
        description="Restore from a CSV or JSON backup. Imported rows are added alongside your existing expenses."
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json"
          onChange={handleImportFile}
          className="hidden"
          id="import-file"
        />
        <label htmlFor="import-file" className="btn-secondary cursor-pointer">
          {importing ? 'Importing…' : 'Choose file'}
        </label>
        {importStatus && (
          <p className={`mt-2 text-[13px] ${importStatus.type === 'error' ? 'text-rust-500' : 'text-pine-600'}`}>
            {importStatus.message}
          </p>
        )}
      </Section>

      <Section title="Account actions">
        <button className="btn-secondary" onClick={handleLogout}>
          Log out
        </button>
      </Section>
    </div>
  )
}

function Section({ title, description, children }) {
  return (
    <div className="rounded-md border border-line bg-surface p-5">
      <h2 className="text-[14px] font-medium text-ink">{title}</h2>
      {description && <p className="mt-1 text-[13px] text-ink-muted">{description}</p>}
      <div className="mt-3">{children}</div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-[14px]">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  )
}
