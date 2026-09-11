const CSV_COLUMNS = [
  'date',
  'category',
  'custom_category',
  'amount',
  'payment_method',
  'custom_payment_method',
]

export function expensesToCSV(expenses) {
  const header = CSV_COLUMNS.join(',')
  const rows = expenses.map((e) =>
    CSV_COLUMNS.map((col) => csvEscape(e[col])).join(',')
  )
  return [header, ...rows].join('\n')
}

function csvEscape(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function expensesToJSON(expenses) {
  return JSON.stringify(
    expenses.map((e) => ({
      date: e.date,
      category: e.category,
      custom_category: e.custom_category,
      amount: e.amount,
      payment_method: e.payment_method,
      custom_payment_method: e.custom_payment_method,
    })),
    null,
    2
  )
}

export function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Parses a CSV or JSON file's text content into an array of plain expense
// objects ready to insert (user_id is attached by the caller).
export function parseImportFile(text, filename) {
  if (filename.toLowerCase().endsWith('.json')) {
    const data = JSON.parse(text)
    if (!Array.isArray(data)) throw new Error('JSON file must contain an array of expenses.')
    return data.map(normalizeRow)
  }
  return parseCSV(text).map(normalizeRow)
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) return []
  const headers = splitCSVLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = splitCSVLine(line)
    const row = {}
    headers.forEach((h, i) => {
      row[h.trim()] = values[i] !== undefined ? values[i] : ''
    })
    return row
  })
}

function splitCSVLine(line) {
  const result = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        cur += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      result.push(cur)
      cur = ''
    } else {
      cur += char
    }
  }
  result.push(cur)
  return result
}

function normalizeRow(row) {
  return {
    date: row.date,
    category: row.category,
    custom_category: row.custom_category || null,
    amount: Number(row.amount) || 0,
    payment_method: row.payment_method,
    custom_payment_method: row.custom_payment_method || null,
  }
}
