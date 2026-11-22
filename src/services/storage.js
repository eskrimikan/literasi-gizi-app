import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Token login disimpan terenkripsi di HP (SecureStore).
// Di browser (expo start --web) SecureStore tidak tersedia, jadi dipakai localStorage.
const isWeb = Platform.OS === 'web';

export async function getItem(key) {
  if (isWeb) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

export async function setItem(key, value) {
  if (isWeb) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // abaikan jika penyimpanan browser tidak tersedia
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function removeItem(key) {
  if (isWeb) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // abaikan
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}
