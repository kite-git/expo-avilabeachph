import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { CustomCategoryIcon, EntryKind } from '@/constants/ledger';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useLedger } from '@/store/ledger-store';

/** Rounded square tile with the icon of a category. */
export function CategoryIcon({ kind, category }: { kind: EntryKind; category: string }) {
  const theme = useTheme();
  const { categories } = useLedger(kind);
  const icon = categories.find((c) => c.name === category)?.icon ?? CustomCategoryIcon;

  return (
    <View style={[styles.tile, { backgroundColor: theme.backgroundSelected }]}>
      <SymbolView name={icon} size={22} tintColor={theme.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 48,
    height: 48,
    borderRadius: Radius.field,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
