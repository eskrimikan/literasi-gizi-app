import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { tabOptions } from '../../components/tabOptions';

// Tab untuk mode anak. Anak hanya melihat data dirinya sendiri.
export default function ChildTabs() {
  return (
    <Tabs screenOptions={tabOptions}>
      <Tabs.Screen
        name="belajar"
        options={{
          title: 'Belajar',
          headerTitle: 'Jalur Belajarku',
          tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lencana"
        options={{
          title: 'Lencana',
          headerTitle: 'Poin dan Lencanaku',
          tabBarIcon: ({ color, size }) => <Ionicons name="ribbon" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          headerTitle: 'Profilku',
          tabBarIcon: ({ color, size }) => <Ionicons name="happy" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
