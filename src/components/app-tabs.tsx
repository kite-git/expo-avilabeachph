import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { Tabs, TabList, TabListProps, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { SymbolName } from '@/constants/ledger';
import { FontFamily, Radius, Shadow, Spacing } from '@/constants/theme';
import { useIsTablet } from '@/hooks/use-is-tablet';
import { useTheme } from '@/hooks/use-theme';

type TabConfig = {
  name: string;
  href: Href;
  label: string;
  icon: SymbolName;
};

const TABS: TabConfig[] = [
  {
    name: 'index',
    href: '/',
    label: 'Dashboard',
    icon: { ios: 'square.grid.2x2', android: 'dashboard', web: 'dashboard' },
  },
  {
    name: 'cash-in',
    href: '/cash-in',
    label: 'Cash In',
    icon: { ios: 'arrow.down.circle', android: 'download', web: 'download' },
  },
  {
    name: 'expenses',
    href: '/expenses',
    label: 'Expenses',
    icon: { ios: 'arrow.up.circle', android: 'upload', web: 'upload' },
  },
  {
    name: 'revenue',
    href: '/revenue',
    label: 'Revenue',
    icon: { ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' },
  },
];

const PLUS_ICON: SymbolName = { ios: 'plus', android: 'add', web: 'add' };

/**
 * Phones: floating brown pill with icon-only tabs and a yellow "+" in the middle.
 * Tablets: vertical rail on the left with "+" at the top.
 */
export default function AppTabs() {
  const isTablet = useIsTablet();
  const triggers = TABS.map((tab) => (
    <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
      <TabItem label={tab.label} icon={tab.icon} variant={isTablet ? 'rail' : 'bar'} />
    </TabTrigger>
  ));

  if (isTablet) {
    return (
      <Tabs style={styles.tabletRoot}>
        <TabList asChild>
          <SideRail>{triggers}</SideRail>
        </TabList>
        <TabSlot style={styles.slot} />
      </Tabs>
    );
  }

  return (
    <Tabs style={styles.phoneRoot}>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <BottomBar>
          {triggers.slice(0, 2)}
          <AddButton variant="bar" />
          {triggers.slice(2)}
        </BottomBar>
      </TabList>
    </Tabs>
  );
}

type TabItemProps = TabTriggerSlotProps & {
  label: string;
  icon: SymbolName;
  variant: 'bar' | 'rail';
};

function TabItem({ label, icon, variant, isFocused, ...props }: TabItemProps) {
  const theme = useTheme();

  if (variant === 'bar') {
    return (
      <Pressable
        {...props}
        accessibilityRole="tab"
        accessibilityLabel={label}
        accessibilityState={{ selected: isFocused }}
        style={({ pressed }) => [styles.barItem, pressed && styles.pressed]}>
        <View style={[styles.barCircle, isFocused && { backgroundColor: theme.background }]}>
          <SymbolView name={icon} size={24} tintColor={isFocused ? theme.primary : theme.brownSoft} />
        </View>
      </Pressable>
    );
  }

  const color = isFocused ? theme.primary : theme.textMuted;

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      style={({ pressed }) => [
        styles.railItem,
        isFocused && { backgroundColor: theme.accentSoft },
        pressed && styles.pressed,
      ]}>
      <SymbolView name={icon} size={24} tintColor={color} />
      <ThemedText style={[styles.itemLabel, { color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function AddButton({ variant }: { variant: 'bar' | 'rail' }) {
  const theme = useTheme();

  return (
    <View style={variant === 'bar' ? styles.barItem : undefined}>
      {/* Not wrapped in <Link asChild>: its Slot drops function styles, which hid the circle. */}
      <Pressable
        onPress={() => router.push('/add')}
        accessibilityRole="button"
        accessibilityLabel="Add entry"
        style={({ pressed }) => [
          variant === 'bar'
            ? [styles.barCircle, { backgroundColor: theme.accent }]
            : [styles.addRail, { backgroundColor: theme.primary }],
          pressed && styles.pressed,
        ]}>
        <SymbolView
          name={PLUS_ICON}
          size={26}
          tintColor={variant === 'bar' ? theme.onAccent : theme.accent}
        />
      </Pressable>
    </View>
  );
}

function BottomBar({ children, style, ...props }: TabListProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.barArea,
        {
          backgroundColor: theme.background,
          paddingBottom: Math.max(insets.bottom, Spacing.three),
          paddingLeft: insets.left + Spacing.four,
          paddingRight: insets.right + Spacing.four,
        },
      ]}>
      <View {...props} style={[styles.bar, { backgroundColor: theme.primary }]}>
        {children}
      </View>
    </View>
  );
}

function SideRail({ children, style, ...props }: TabListProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[
        styles.rail,
        {
          backgroundColor: theme.backgroundElement,
          borderRightColor: theme.border,
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + Spacing.four,
          paddingLeft: insets.left,
        },
      ]}>
      <Image
        source={require('@/assets/images/logo-mark.jpg')}
        style={styles.logo}
        contentFit="contain"
        accessibilityLabel="Avila Beach PH"
      />
      <AddButton variant="rail" />
      <View style={styles.railItems}>{children}</View>
    </View>
  );
}

const BAR_CIRCLE_SIZE = 52;
const ADD_RAIL_SIZE = 56;

const styles = StyleSheet.create({
  phoneRoot: {
    flex: 1,
  },
  tabletRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  slot: {
    flex: 1,
  },
  barArea: {
    paddingTop: Spacing.two,
  },
  bar: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    borderRadius: Radius.pill,
    boxShadow: Shadow.raised,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
  },
  barCircle: {
    width: BAR_CIRCLE_SIZE,
    height: BAR_CIRCLE_SIZE,
    borderRadius: BAR_CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: FontFamily.semibold,
  },
  rail: {
    width: 104,
    alignItems: 'center',
    gap: Spacing.four,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  logo: {
    width: 80,
    aspectRatio: 512 / 472,
  },
  addRail: {
    width: ADD_RAIL_SIZE,
    height: ADD_RAIL_SIZE,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: Shadow.raised,
  },
  railItems: {
    gap: Spacing.two,
  },
  railItem: {
    width: 80,
    paddingVertical: Spacing.two + Spacing.half,
    borderRadius: Radius.tile,
    alignItems: 'center',
    gap: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
