import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { tabOptions } from '../../components/tabOptions';
import { colors } from '../../theme';

// Tab untuk mode anak (warna hijau). Anak hanya melihat data dirinya sendiri.
export default function ChildTabs() {
  return (
    <Tabs screenOptions={tabOptions(colors.primaryDark)}>
      <Tabs.Screen
        name="belajar"
        options={{
          title: 'Belajar',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lencana"
        options={{
          title: 'Lencana',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'ribbon' : 'ribbon-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'happy' : 'happy-outline'} size={size + 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
