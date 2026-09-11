export const CATEGORIES = ['Bus', 'Train', 'Auto Rickshaw', 'Food', 'Other']

export const PAYMENT_METHODS = ['UPI', 'Cash', 'Other']

// Muted, restrained palette per category — used for chart segments and tags.
// Deliberately avoids a rainbow look; stays within the app's tonal palette.
export const CATEGORY_COLORS = {
  Bus: '#2F5D50',
  Train: '#7DA396',
  'Auto Rickshaw': '#C9A227',
  Food: '#B4483A',
  Other: '#9A9DA3',
}

export const CURRENCY_SYMBOL = '₹'

export function formatINR(amount) {
  const n = Number(amount) || 0
  return `${CURRENCY_SYMBOL}${n.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function categoryLabel(expense) {
  return expense.category === 'Other' && expense.custom_category
    ? expense.custom_category
    : expense.category
}

export function paymentLabel(expense) {
  return expense.payment_method === 'Other' && expense.custom_payment_method
    ? expense.custom_payment_method
    : expense.payment_method
}
