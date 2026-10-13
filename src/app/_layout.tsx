import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors, Radius } from '@/constants/theme';
import { LedgerProvider } from '@/store/ledger-store';

SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.backgroundElement,
    text: Colors.text,
    border: Colors.border,
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  // The splash screen stays up until the overlay renders, so it covers font loading.
  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={navigationTheme}>
      <LedgerProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="add"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: 'fitToContents',
              sheetGrabberVisible: true,
              sheetCornerRadius: Radius.sheet,
              contentStyle: { backgroundColor: Colors.backgroundElement },
            }}
          />
          <Stack.Screen name="add-cash-in" />
          <Stack.Screen name="add-expense" />
        </Stack>
      </LedgerProvider>
      <AnimatedSplashOverlay />
    </ThemeProvider>
  );
}
