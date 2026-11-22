import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useAuth();

  if (isLoading) return null;
  SplashScreen.hide();

  const isParent = session?.role === 'parent';
  const isChild = session?.role === 'child';

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primaryDark,
        headerTitleStyle: { fontFamily: fonts.semibold, color: colors.text },
        headerShadowVisible: false,
        headerBackTitle: 'Kembali',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Belum login */}
      <Stack.Protected guard={!session}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ title: 'Daftar Orang Tua' }} />
        <Stack.Screen name="child-login" options={{ title: 'Masuk sebagai Anak' }} />
      </Stack.Protected>

      {/* Mode orang tua */}
      <Stack.Protected guard={isParent}>
        <Stack.Screen name="(parent)" options={{ headerShown: false }} />
        <Stack.Screen name="tambah-anak" options={{ title: 'Tambah Profil Anak' }} />
      </Stack.Protected>

      {/* Mode anak */}
      <Stack.Protected guard={isChild}>
        <Stack.Screen name="(child)" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Dipakai orang tua dan anak */}
      <Stack.Protected guard={Boolean(session)}>
        <Stack.Screen name="jalur/[playerId]" options={{ title: 'Jalur Belajar' }} />
        <Stack.Screen name="modul/[moduleId]" options={{ title: 'Materi' }} />
        <Stack.Screen name="kuis/[moduleId]" options={{ title: 'Kuis', gestureEnabled: false }} />
        <Stack.Screen name="hasil" options={{ title: 'Hasil Kuis', headerBackVisible: false, headerLeft: () => null, gestureEnabled: false }} />
      </Stack.Protected>
    </Stack>
  );
}
