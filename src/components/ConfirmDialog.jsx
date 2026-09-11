import React from 'react'

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Delete', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 px-4 pb-6 md:items-center md:pb-0">
      <div className="w-full max-w-sm rounded-md border border-line bg-surface p-5 shadow-subtle">
        <h3 className="text-[16px] font-medium text-ink">{title}</h3>
        {description && <p className="mt-1.5 text-[13px] text-ink-muted">{description}</p>}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center rounded bg-rust-500 px-4 py-2.5 text-[15px] font-medium text-white hover:opacity-90 transition-opacity"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button type="button" className="btn-secondary flex-1" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
