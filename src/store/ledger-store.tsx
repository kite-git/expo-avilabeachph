import { createContext, PropsWithChildren, use, useState } from 'react';

import {
  CustomCategoryIcon,
  DefaultCategories,
  EntryKind,
  LedgerCategory,
  LedgerEntry,
  NewLedgerEntry,
} from '@/constants/ledger';

type LedgerStore = {
  entries: LedgerEntry[];
  categories: Record<EntryKind, LedgerCategory[]>;
  addEntry: (kind: EntryKind, entry: NewLedgerEntry) => void;
  addCategory: (kind: EntryKind, name: string) => string;
};

const LedgerContext = createContext<LedgerStore | null>(null);

/** In-memory store for Cash In and Expenses entries; data resets when the app reloads. */
export function LedgerProvider({ children }: PropsWithChildren) {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [categories, setCategories] = useState(DefaultCategories);

  function addEntry(kind: EntryKind, entry: NewLedgerEntry) {
    const createdAt = new Date();
    const id = `${createdAt.getTime()}-${Math.random().toString(36).slice(2, 8)}`;
    setEntries((current) => [...current, { ...entry, id, kind, createdAt }]);
  }

  function addCategory(kind: EntryKind, name: string) {
    const trimmed = name.trim();
    const existing = categories[kind].find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) return existing.name;
    setCategories((current) => ({
      ...current,
      [kind]: [...current[kind], { name: trimmed, icon: CustomCategoryIcon }],
    }));
    return trimmed;
  }

  return (
    <LedgerContext value={{ entries, categories, addEntry, addCategory }}>{children}</LedgerContext>
  );
}

/** Every entry, Cash In and Expenses, e.g. for reports. */
export function useAllEntries() {
  const store = use(LedgerContext);
  if (!store) throw new Error('useAllEntries must be used inside <LedgerProvider>');
  return store.entries;
}

/** Entries and categories of one kind, with actions bound to that kind. */
export function useLedger(kind: EntryKind) {
  const store = use(LedgerContext);
  if (!store) throw new Error('useLedger must be used inside <LedgerProvider>');

  return {
    entries: store.entries.filter((entry) => entry.kind === kind),
    categories: store.categories[kind],
    addEntry: (entry: NewLedgerEntry) => store.addEntry(kind, entry),
    /** Adds a category if none with that name exists yet. Returns the stored name. */
    addCategory: (name: string) => store.addCategory(kind, name),
  };
}
