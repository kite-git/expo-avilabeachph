import { EntryKind, LedgerEntry, PaymentMethod, PaymentMethods } from '@/constants/ledger';
import { DateRange, isInRange } from '@/utils/period';

export type Totals = {
  income: number;
  expenses: number;
  net: number;
};

export function entriesInRange(entries: LedgerEntry[], range: DateRange) {
  return entries.filter((entry) => isInRange(entry.date, range));
}

export function getTotals(entries: LedgerEntry[]): Totals {
  let income = 0;
  let expenses = 0;
  for (const entry of entries) {
    if (entry.kind === 'in') income += entry.amount;
    else expenses += entry.amount;
  }
  return { income, expenses, net: income - expenses };
}

/**
 * Change from `previous` to `current` as a fraction (0.12 = +12%).
 * Null when there is nothing to compare against.
 */
export function percentChange(current: number, previous: number) {
  if (previous === 0) return null;
  return (current - previous) / Math.abs(previous);
}

export type CategoryShare = {
  name: string;
  amount: number;
  /** Fraction of the kind's total, 0–1. */
  share: number;
};

/** Categories of one kind, largest first. */
export function getCategoryShares(entries: LedgerEntry[], kind: EntryKind): CategoryShare[] {
  const sums = new Map<string, number>();
  for (const entry of entries) {
    if (entry.kind !== kind) continue;
    sums.set(entry.category, (sums.get(entry.category) ?? 0) + entry.amount);
  }
  const total = [...sums.values()].reduce((a, b) => a + b, 0);
  return [...sums.entries()]
    .map(([name, amount]) => ({ name, amount, share: total ? amount / total : 0 }))
    .sort((a, b) => b.amount - a.amount);
}

export type MethodTotals = Totals & { method: PaymentMethod };

/** Income, expenses and net per payment method, in the fixed method order; unused methods are left out. */
export function getMethodTotals(entries: LedgerEntry[]): MethodTotals[] {
  return PaymentMethods.map((method) => ({
    method,
    ...getTotals(entries.filter((entry) => entry.method === method)),
  })).filter((row) => row.income > 0 || row.expenses > 0);
}
