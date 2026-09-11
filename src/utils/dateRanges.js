// All dates are handled as local-date strings (YYYY-MM-DD) to avoid timezone
// surprises, since expenses are entered as "the day this happened" rather
// than an exact instant.

export function todayStr() {
  return toLocalDateStr(new Date())
}

export function toLocalDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday
  const diff = day === 0 ? 6 : day - 1 // week starts Monday
  d.setDate(d.getDate() - diff)
  return d
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// Returns { start, end } as YYYY-MM-DD strings (inclusive) for a named period.
export function getRangeForPeriod(period, customRange) {
  const now = new Date()
  const today = toLocalDateStr(now)

  switch (period) {
    case 'today':
      return { start: today, end: today }
    case 'week':
      return { start: toLocalDateStr(startOfWeek(now)), end: today }
    case 'month':
      return { start: toLocalDateStr(startOfMonth(now)), end: today }
    case 'custom':
      return {
        start: customRange?.start || today,
        end: customRange?.end || today,
      }
    default:
      return { start: today, end: today }
  }
}

export function periodLabel(period) {
  switch (period) {
    case 'today':
      return 'Today'
    case 'week':
      return 'This week'
    case 'month':
      return 'This month'
    case 'custom':
      return 'Custom range'
    default:
      return ''
  }
}
