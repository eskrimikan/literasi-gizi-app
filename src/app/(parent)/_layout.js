import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { tabOptions } from '../../components/tabOptions';


// Tab untuk mode orang tua.
export default function ParentTabs() {
  return (
    <Tabs screenOptions={tabOptions}>
      <Tabs.Screen
        name="anak"
        options={{
          title: 'Anak',
          headerTitle: 'Profil Anak',
          tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progres"
        options={{
          title: 'Progres',
          headerTitle: 'Laporan Progres',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="akun"
        options={{
          title: 'Akun',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
