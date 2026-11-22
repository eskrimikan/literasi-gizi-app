import { Platform } from 'react-native';
import { colors, fonts } from '../theme';

// Gaya tab bar untuk mode orang tua dan mode anak. Judul halaman tab
// digambar sendiri di setiap layar (komponen Hero), jadi header bawaan disembunyikan.
export function tabOptions(activeColor = colors.primary) {
  return {
    headerShown: false,
    tabBarActiveTintColor: activeColor,
    tabBarInactiveTintColor: colors.locked,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopWidth: 2,
      borderTopColor: colors.border,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      ...(Platform.OS === 'web' ? { height: 80, paddingBottom: 12, paddingTop: 8 } : { paddingTop: 6 }),
    },
    tabBarLabelStyle: { fontFamily: fonts.heading, fontSize: 13, lineHeight: 20 },
    tabBarItemStyle: { paddingBottom: 2 },
    sceneStyle: { backgroundColor: colors.background },
  };
}
