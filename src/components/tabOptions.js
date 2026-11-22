import { Platform } from 'react-native';
import { colors, fonts } from '../theme';

// Gaya tab bar yang sama untuk mode orang tua dan mode anak.
export const tabOptions = {
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    // Di web tidak ada safe area bawah, jadi tinggi tab bar ditambah agar label tidak terpotong.
    ...(Platform.OS === 'web' ? { height: 68, paddingBottom: 10, paddingTop: 6 } : {}),
  },
  tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 18 },
  headerStyle: { backgroundColor: colors.background },
  headerTitleStyle: { fontFamily: fonts.semibold, color: colors.text },
  headerShadowVisible: false,
  sceneStyle: { backgroundColor: colors.background },
};
