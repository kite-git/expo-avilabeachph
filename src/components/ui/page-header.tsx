import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Rendered on the right, e.g. an IconButton. */
  accessory?: ReactNode;
};

/** Large title header for the top level (tab) screens. */
export function PageHeader({ title, subtitle, accessory }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.text}>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        ) : null}
        <ThemedText type="subtitle">{title}</ThemedText>
      </View>
      {accessory}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  text: {
    flex: 1,
  },
});
