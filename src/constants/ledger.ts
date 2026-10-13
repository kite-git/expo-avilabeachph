import type { Href } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';

export type SymbolName = SymbolViewProps['name'];

/** Money coming in (Cash In) or going out (Expenses). */
export type EntryKind = 'in' | 'out';

export type LedgerCategory = {
  name: string;
  icon: SymbolName;
};

export const DefaultCategories: Record<EntryKind, LedgerCategory[]> = {
  in: [
    { name: 'Food', icon: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' } },
    { name: 'Cottage', icon: { ios: 'house', android: 'cottage', web: 'cottage' } },
    { name: 'Room', icon: { ios: 'bed.double', android: 'bed', web: 'bed' } },
  ],
  out: [
    { name: 'Supplies', icon: { ios: 'shippingbox', android: 'inventory_2', web: 'inventory_2' } },
    { name: 'Utilities', icon: { ios: 'bolt', android: 'bolt', web: 'bolt' } },
    { name: 'Salaries', icon: { ios: 'person.2', android: 'groups', web: 'groups' } },
    {
      name: 'Maintenance',
      icon: { ios: 'wrench.and.screwdriver', android: 'build', web: 'build' },
    },
  ],
};

/** Icon for categories staff add themselves. */
export const CustomCategoryIcon: SymbolName = { ios: 'tag', android: 'sell', web: 'sell' };

export const PaymentMethods = ['Cash', 'GCash', 'Bank Transfer', 'Card'] as const;

export type PaymentMethod = (typeof PaymentMethods)[number];

export type LedgerEntry = {
  id: string;
  kind: EntryKind;
  /** Day the money moved (chosen by staff, defaults to today). */
  date: Date;
  amount: number;
  category: string;
  method: PaymentMethod;
  note: string;
  createdAt: Date;
};

export type NewLedgerEntry = Omit<LedgerEntry, 'id' | 'kind' | 'createdAt'>;

/** Wording, routes and icons that differ between Cash In and Expenses screens. */
export const KindConfig = {
  in: {
    title: 'Cash In',
    addTitle: 'Add Cash In',
    /** Short label for the add button in the dashboard balance card. */
    actionLabel: 'Cash In',
    addCaption: 'Money received',
    addRoute: '/add-cash-in',
    listRoute: '/cash-in',
    categoryLabel: 'Source',
    newCategoryPlaceholder: 'New source, e.g. Entrance fee',
    notePlaceholder: 'e.g. Cottage 4, Santos family',
    totalLabel: 'Total cash in',
    emptyMessage: 'No cash in recorded yet. Tap + to add the first one.',
    sign: '+',
    icon: { ios: 'arrow.down.circle', android: 'download', web: 'download' },
  },
  out: {
    title: 'Expenses',
    addTitle: 'Add Expense',
    actionLabel: 'Expense',
    addCaption: 'Money spent',
    addRoute: '/add-expense',
    listRoute: '/expenses',
    categoryLabel: 'Category',
    newCategoryPlaceholder: 'New category, e.g. Gasoline',
    notePlaceholder: 'e.g. Ice delivery, Mang Jose',
    totalLabel: 'Total expenses',
    emptyMessage: 'No expenses recorded yet. Tap + to add the first one.',
    sign: '−',
    icon: { ios: 'arrow.up.circle', android: 'upload', web: 'upload' },
  },
} as const satisfies Record<
  EntryKind,
  {
    title: string;
    addTitle: string;
    actionLabel: string;
    addCaption: string;
    addRoute: Href;
    listRoute: Href;
    categoryLabel: string;
    newCategoryPlaceholder: string;
    notePlaceholder: string;
    totalLabel: string;
    emptyMessage: string;
    sign: string;
    icon: SymbolName;
  }
>;
