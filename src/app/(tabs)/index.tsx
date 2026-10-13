import { Href, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BalanceCard } from '@/components/dashboard/balance-card';
import { CategoryCards } from '@/components/dashboard/category-cards';
import { EntryList } from '@/components/ledger/entry-list';
import { ThemedText } from '@/components/themed-text';
import { KindConfig } from '@/constants/ledger';
import { FontFamily, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useIsTablet } from '@/hooks/use-is-tablet';
import { useTheme } from '@/hooks/use-theme';
import { useAllEntries } from '@/store/ledger-store';
import { formatLongDate } from '@/utils/date';
import { entriesInRange, getTotals } from '@/utils/ledger-stats';
import { getRange } from '@/utils/period';

const RECENT_LIMIT = 5;

function greeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isTablet = useIsTablet();
  const allEntries = useAllEntries();

  const now = new Date();
  const todayEntries = entriesInRange(allEntries, getRange('day', now));

  const overview = (
    <>
      <BalanceCard balance={getTotals(allEntries).net} todayNet={getTotals(todayEntries).net} />
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Top categories today</ThemedText>
          <Pressable
            onPress={() => router.navigate('/revenue')}
            accessibilityRole="link"
            style={({ pressed }) => [styles.viewAll, pressed && styles.pressed]}>
            <ThemedText type="small" style={styles.viewAllLabel}>
              View all
            </ThemedText>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={12}
              tintColor={theme.text}
            />
          </Pressable>
        </View>
        <CategoryCards entries={todayEntries} />
      </View>
    </>
  );

  const details = (
    <EntryList
      title="Recent activity"
      entries={allEntries}
      limit={RECENT_LIMIT}
      emptyMessage="Nothing recorded yet. Tap + to add cash in or an expense."
      footer={
        <View style={styles.seeAll}>
          <SeeAllLink label="All cash in" href={KindConfig.in.listRoute} />
          <SeeAllLink label="All expenses" href={KindConfig.out.listRoute} />
        </View>
      }
    />
  );

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.content,
        isTablet && styles.contentTablet,
        {
          paddingTop: insets.top + (isTablet ? Spacing.four : Spacing.three),
          paddingBottom: isTablet ? insets.bottom + Spacing.five : Spacing.four,
        },
      ]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText type="subtitle">{greeting(now)}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatLongDate(now)}
          </ThemedText>
        </View>
      </View>

      {isTablet ? (
        <View style={styles.columns}>
          <View style={styles.column}>{overview}</View>
          <View style={styles.column}>{details}</View>
        </View>
      ) : (
        <>
          {overview}
          {details}
        </>
      )}
    </ScrollView>
  );
}

function SeeAllLink({ label, href }: { label: string; href: Href }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => router.navigate(href)}
      accessibilityRole="link"
      style={({ pressed }) => [
        styles.seeAllLink,
        { backgroundColor: theme.backgroundSelected },
        pressed && styles.pressed,
      ]}>
      <ThemedText type="small" style={styles.seeAllLabel}>
        {label}
      </ThemedText>
      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        size={12}
        tintColor={theme.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  contentTablet: {
    paddingHorizontal: Spacing.five,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  headerText: {
    flex: 1,
  },
  section: {
    gap: Spacing.three,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  sectionTitle: {
    flexShrink: 1,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.bold,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.one,
  },
  viewAllLabel: {
    fontFamily: FontFamily.semibold,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.four,
  },
  column: {
    flex: 1,
    gap: Spacing.four,
  },
  seeAll: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  seeAllLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two + Spacing.half,
    borderRadius: Radius.pill,
  },
  seeAllLabel: {
    fontFamily: FontFamily.semibold,
  },
  pressed: {
    opacity: 0.7,
  },
});
