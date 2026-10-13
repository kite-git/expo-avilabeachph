const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

export function formatPeso(amount: number) {
  return pesoFormatter.format(amount);
}

/** Keeps only digits and a single decimal point with at most two decimals. */
export function sanitizeAmountInput(text: string) {
  const [whole, ...rest] = text.replace(/[^0-9.]/g, '').split('.');
  if (rest.length === 0) return whole;
  return `${whole}.${rest.join('').slice(0, 2)}`;
}

/** Adds thousands separators to a sanitized amount for display, e.g. "1368.5" → "1,368.5". */
export function formatAmountInput(raw: string) {
  const [whole, decimals] = raw.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimals === undefined ? grouped : `${grouped}.${decimals}`;
}

/** Short peso amounts for chart axes, e.g. "₱950", "₱12.5k", "₱1.2M". */
export function formatPesoCompact(amount: number) {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '−' : '';
  if (abs >= 1_000_000) return `${sign}₱${trimZero(abs / 1_000_000)}M`;
  if (abs >= 1_000) return `${sign}₱${trimZero(abs / 1_000)}k`;
  return `${sign}₱${Math.round(abs)}`;
}

function trimZero(value: number) {
  return value.toFixed(value >= 100 ? 0 : 1).replace(/\.0$/, '');
}

/** Signed peso amount with a real minus sign, e.g. "−₱1,200.00". */
export function formatSignedPeso(amount: number) {
  return amount < 0 ? `−${formatPeso(-amount)}` : formatPeso(amount);
}
