import { useWindowDimensions } from 'react-native';

import { TabletMinShortSide } from '@/constants/theme';

/**
 * True on tablets and iPads, in either orientation. Uses the shortest side so a phone
 * turned sideways keeps the phone layout.
 */
export function useIsTablet() {
  const { width, height } = useWindowDimensions();
  return Math.min(width, height) >= TabletMinShortSide;
}
