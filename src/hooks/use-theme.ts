import { Colors } from '@/constants/theme';

/** The app ships a single light palette; this hook keeps a seam if that ever changes. */
export function useTheme() {
  return Colors;
}
