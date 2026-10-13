@AGENTS.md

# Avila Beach PH — project guide

Resort manager app used by **employees** of Avila Beach PH to record money coming in (Cash In) and going out (Expenses), and to see revenue. Mobile-first: phone **and** tablet/iPad. Not a web app (web exists only because the Expo template ships it).

This file describes what exists. **Verify against the code before relying on it** — read the file you are about to touch, and never invent components, hooks, props, routes or tokens that you have not seen in `src/`. If something here disagrees with the code, the code wins; update this file.

## How to work on this project

- The user builds the app **one piece at a time**. Build only what was asked. Do not add features, screens, persistence, settings, auth, etc. unless requested.
- When the user says "ask me questions", ask them (AskUserQuestion) **before** writing code.
- When the user says "just answer", answer in text only — no edits.
- Keep the existing design language for new screens ("maintain the same design").
- Before finishing: `npx tsc --noEmit` and `npx expo lint` must both be clean. A bundle check is `npx expo export --platform ios --platform android --output-dir <scratchpad dir>` (never into the repo).
- Nothing has been checked on a real device or simulator; say so rather than claiming visual verification.

## Stack (check `package.json` before assuming versions)

- Expo SDK 57, expo-router ~57 (typed routes + React Compiler enabled in `app.json`), React Native 0.86, React 19.2, TypeScript ~6. Package manager: **npm** (`package-lock.json`).
- `npx expo install <pkg>` fails with npm ERESOLVE because of the user's ESLint devDeps (`@eslint/js` ^10 vs `eslint` ^9). Use `npx expo install <pkg> -- --legacy-peer-deps`. Do not change the user's ESLint setup unless asked.
- Two ESLint configs exist (`eslint.config.js` = Expo's, `eslint.config.mts` = the user's). Leave both alone.
- Icons: `SymbolView` from `expo-symbols`, always with `{ ios, android, web }` names (SF Symbol for iOS, Material Symbols name for android/web). Type: `SymbolName` from `@/constants/ledger`.
- Images: `Image` from `expo-image`.
- Font: DM Sans via `@expo-google-fonts/dm-sans`, loaded in `src/app/_layout.tsx`. Use `FontFamily.*` from theme — **never `fontWeight`** (it won't map to the loaded faces).
- React 19 idioms in use: `use(Context)` instead of `useContext`, `<Context value>` instead of `<Context.Provider>`. Avoid `Array.prototype.toSorted` (use `[...arr].sort`).

## Design system — `src/constants/theme.ts`
- Palette: yellow, white, brown. **Light mode only** (`userInterfaceStyle: "light"`; no dark palette, the color-scheme hooks were deleted on purpose).
- `useTheme()` (`src/hooks/use-theme.ts`) returns `Colors`. Tokens: `text`, `textSecondary`, `textMuted`, `background` (cream #F6F2EC), `backgroundElement` (white, cards), `backgroundSelected`, `border`, `primary` (brown #4A3222), `onPrimary`, `accent` (yellow #F5C33B), `onAccent`, `accentSoft`, `brownSoft`.
- Also: `Radius`, `Shadow` (`card`, `raised` — boxShadow strings), `Spacing` (`half, one…six` = 2,4,8,16,24,32,64), `MaxContentWidth`, `MaxFormWidth`, `TabletMinShortSide`, `ChartColors` (`income`, `expenses` — validated with the dataviz validator; gold is <3:1 contrast so charts keep a legend and tap-to-read values).
- `ThemedText` types: check `src/components/themed-text.tsx` for the actual list (e.g. `subtitle`, `small`, `smallBold`) and the `themeColor` prop. `ThemedView` takes `type` (a theme color key).
- UI conventions: white cards with `Radius.card` + `Shadow.card` on the cream background; brown hero cards; yellow highlights.
- Text must **not truncate with "..."**: labels wrap; money amounts use `numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}`. Paired cards (e.g. Add Cash In / Add Expense) must look identical (same color, same caption length).

## Wording

- Use **"Expenses"**, never "Cash Out" — in UI text, routes and code.
- Currency is Philippine peso. Format with `src/utils/currency.ts` (`formatPeso`, `formatSignedPeso`, `formatPesoCompact`, …). Don't hand-format numbers.
- Per-kind strings, routes and icons live in `KindConfig` (`src/constants/ledger.ts`). Reuse them instead of hardcoding "Cash In"/"Expenses" text.

## Layout: phone vs tablet

- `useIsTablet()` = shortest window side ≥ 600, so a rotated phone stays a phone.
- Phone: floating brown pill tab bar, icons only (Dashboard, Cash In, yellow **+** circle, Expenses, Revenue); the active tab gets a cream circle. The pill sits below the screen content (content does not scroll under it).
- Tablet: left side rail (logo, + button, tab items) and two-column screen content.
- Both are in `src/components/app-tabs.tsx`, built with headless `Tabs/TabList/TabTrigger/TabSlot` from `expo-router/ui` (not NativeTabs, not `@react-navigation/bottom-tabs`). There is no `app-tabs.web.tsx`.

## Routes (`src/app/`)

- `_layout.tsx` — fonts, navigation `ThemeProvider`, `LedgerProvider`, root `Stack` (headers hidden), `AnimatedSplashOverlay`.
- `(tabs)/_layout.tsx` → `<AppTabs />`.
  - `(tabs)/index.tsx` — Dashboard: greeting + date header (no logo), brown `BalanceCard` (all-time balance, "Today ±₱" chip, round actions Cash In / Expense / Revenue), "Top categories today" as `CategoryCards` (View all → Revenue), recent activity (5) with "See all" links.
  - `(tabs)/cash-in.tsx`, `(tabs)/expenses.tsx` — both render `LedgerScreen` with `kind="in" | "out"`.
  - `(tabs)/revenue.tsx` — net revenue (income − expenses) with Day/Week/Month/Year periods, period navigator, comparison to previous period, trend chart, by category, by payment method.
- `add.tsx` — form sheet opened by "+" (`presentation: 'formSheet'`, `sheetAllowedDetents: 'fitToContents'`); picks Cash In or Expense via `router.replace`.
- `add-cash-in.tsx`, `add-expense.tsx` — render `AddEntryScreen kind=…`; saving returns with `router.dismissTo`.
- Navigating to tab lists from elsewhere uses `router.navigate(KindConfig[kind].listRoute)`.

## Code map

- `src/constants/ledger.ts` — types (`EntryKind = 'in' | 'out'`, `LedgerEntry`, `NewLedgerEntry`, `LedgerCategory`, `PaymentMethod`), `KindConfig.actionLabel` is the short add label ("Cash In" / "Expense"). `DefaultCategories` (in: Food, Cottage, Room; out: Supplies, Utilities, Salaries, Maintenance), `PaymentMethods` (Cash, GCash, Bank Transfer, Card), `KindConfig`.
- `src/store/ledger-store.tsx` — `LedgerProvider`, `useAllEntries()`, `useLedger(kind)` → `{ entries, categories, addEntry, addCategory }`. **In-memory only — data resets on reload.** No AsyncStorage/SQLite/backend exists yet.
- `src/utils/` — `currency.ts`, `date.ts` (formatting, `startOfDay`, `addDays`, `startOfWeek`, `isSameDay`), `period.ts` (`Period`, `getRange`, `shiftAnchor`, `formatRange`, `getBuckets`, `isInRange`, `previousLabel`), `ledger-stats.ts` (`entriesInRange`, `getTotals`, `percentChange`, `getCategoryShares`, `getMethodTotals`).
- `src/components/ui/` — `action-card`, `form-field` (`FormField`, `FieldInput`), `icon-button`, `page-header`, `screen-header`, `primary-button`, `segmented-control`, `week-calendar`.
- `src/components/ledger/` — `entry-form`, `entry-list`, `entry-summary`, `ledger-screen`, `add-entry-screen`, `category-icon`.
- `src/components/dashboard/` — `balance-card`, `category-cards` (outer white card, inner cream card with amount / of total / share bar; tap → kind's list).
- `src/components/revenue/` — `net-summary`, `trend-chart` (plain `View` grouped bars, no chart library), `category-breakdown`, `method-breakdown`, `period-navigator`.
- Template leftovers still on disk but unused: `external-link`, `hint-row`, `web-badge`, `ui/collapsible`, `scripts/reset-project.js`, react/expo logo and tabIcons images. Don't build on them; don't delete them unless asked.

## Assets

- `assets/images/logo.jpg` — user's original logo (1638×1638, white background).
- `assets/images/logo-mark.jpg` — cropped version (512×472) used in the dashboard header and tablet rail, always on a white surface (a JPG can't be transparent). If a transparent `logo.png` is added later, it can sit directly on the cream background.
- App icon and splash in `app.json` are still the Expo defaults.
