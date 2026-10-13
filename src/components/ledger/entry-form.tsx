import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FieldInput, FormField } from '@/components/ui/form-field';
import { PrimaryButton } from '@/components/ui/primary-button';
import { WeekCalendar } from '@/components/ui/week-calendar';
import { EntryKind, KindConfig, PaymentMethod, PaymentMethods } from '@/constants/ledger';
import { FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLedger } from '@/store/ledger-store';
import { formatAmountInput, sanitizeAmountInput } from '@/utils/currency';
import { startOfDay } from '@/utils/date';

type EntryFormProps = {
  kind: EntryKind;
  /** Called after an entry is saved, e.g. to close the screen. */
  onSaved?: () => void;
};

export function EntryForm({ kind, onSaved }: EntryFormProps) {
  const theme = useTheme();
  const config = KindConfig[kind];
  const { categories, addEntry, addCategory } = useLedger(kind);

  const [date, setDate] = useState(() => startOfDay(new Date()));
  const [note, setNote] = useState('');
  const [amountText, setAmountText] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('Cash');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const amount = Number(amountText);
  const canSave = amount > 0 && category !== null;

  function saveNewCategory() {
    if (!newCategory.trim()) return;
    setCategory(addCategory(newCategory));
    setNewCategory('');
    setIsAddingCategory(false);
  }

  function handleSave() {
    if (!canSave) return;
    addEntry({ date, amount, category, method, note: note.trim() });
    // Keep date and payment method: staff often log several entries for the same day in a row.
    setNote('');
    setAmountText('');
    setCategory(null);
    onSaved?.();
  }

  return (
    <View style={styles.form}>
      <WeekCalendar value={date} onChange={setDate} />

      <FormField label="Amount">
        <FieldInput
          value={formatAmountInput(amountText)}
          onChangeText={(text) => setAmountText(sanitizeAmountInput(text))}
          placeholder="0.00"
          keyboardType="decimal-pad"
          accessibilityLabel="Amount in pesos"
          size="large"
          trailing={<ThemedText style={[styles.peso, { color: theme.textSecondary }]}>₱</ThemedText>}
        />
      </FormField>

      <FormField label={config.categoryLabel}>
        <View style={styles.tiles}>
          <Pressable
            onPress={() => setIsAddingCategory(!isAddingCategory)}
            accessibilityRole="button"
            accessibilityLabel={
              isAddingCategory
                ? `Cancel new ${config.categoryLabel.toLowerCase()}`
                : `Add a new ${config.categoryLabel.toLowerCase()}`
            }
            style={({ pressed }) => [
              styles.tile,
              styles.addTile,
              { borderColor: theme.textMuted },
              pressed && styles.pressed,
            ]}>
            <SymbolView
              name={
                isAddingCategory
                  ? { ios: 'xmark', android: 'close', web: 'close' }
                  : { ios: 'plus', android: 'add', web: 'add' }
              }
              size={18}
              tintColor={theme.textSecondary}
            />
          </Pressable>

          {categories.map((option) => {
            const selected = option.name === category;
            const color = selected ? theme.onPrimary : theme.text;
            return (
              <Pressable
                key={option.name}
                onPress={() => setCategory(option.name)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.tile,
                  {
                    backgroundColor: selected ? theme.primary : theme.backgroundElement,
                    boxShadow: selected ? Shadow.raised : Shadow.card,
                  },
                  pressed && styles.pressed,
                ]}>
                <SymbolView name={option.icon} size={18} tintColor={color} />
                <ThemedText type="small" style={{ color }}>
                  {option.name}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {isAddingCategory ? (
          <FieldInput
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder={config.newCategoryPlaceholder}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={saveNewCategory}
            accessibilityLabel={`New ${config.categoryLabel.toLowerCase()} name`}
            trailing={
              <Pressable
                onPress={saveNewCategory}
                disabled={!newCategory.trim()}
                accessibilityRole="button"
                hitSlop={8}>
                <ThemedText
                  style={[
                    styles.inlineAction,
                    { color: newCategory.trim() ? theme.primary : theme.textMuted },
                  ]}>
                  Add
                </ThemedText>
              </Pressable>
            }
          />
        ) : null}
      </FormField>

      <FormField label="Payment method">
        <View style={styles.pills}>
          {PaymentMethods.map((option) => {
            const selected = option === method;
            return (
              <Pressable
                key={option}
                onPress={() => setMethod(option)}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={({ pressed }) => [
                  styles.pill,
                  selected
                    ? { backgroundColor: theme.accent, borderColor: theme.accent }
                    : { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                  pressed && styles.pressed,
                ]}>
                <ThemedText
                  type="small"
                  style={{ color: selected ? theme.onAccent : theme.textSecondary }}>
                  {option}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </FormField>

      <FormField label="Note" hint="Optional">
        <FieldInput
          value={note}
          onChangeText={setNote}
          placeholder={config.notePlaceholder}
          returnKeyType="done"
          accessibilityLabel="Note"
        />
      </FormField>

      <View style={styles.submit}>
        <PrimaryButton label={config.addTitle} onPress={handleSave} disabled={!canSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.four,
  },
  peso: {
    fontSize: 20,
    fontFamily: FontFamily.semibold,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  tile: {
    height: 64,
    minWidth: 64,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.tile,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  addTile: {
    paddingHorizontal: 0,
    width: 64,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pill: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  inlineAction: {
    fontFamily: FontFamily.bold,
  },
  submit: {
    marginTop: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
