import { Alert, Platform } from 'react-native';

// Alert bawaan React Native tidak muncul di versi web, jadi di web dipakai
// dialog browser. Di HP (iOS/Android) tetap memakai Alert native.

export function confirmAction({ title, message, confirmText = 'Ya', cancelText = 'Batal', destructive, onConfirm }) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}

export function notify(title, message) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}
