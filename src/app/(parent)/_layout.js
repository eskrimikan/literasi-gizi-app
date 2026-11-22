import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { tabOptions } from '../../components/tabOptions';
import { colors } from '../../theme';

// Tab untuk mode orang tua (warna pink).
export default function ParentTabs() {
  return (
    <Tabs screenOptions={tabOptions(colors.pinkDark)}>
      <Tabs.Screen
        name="anak"
        options={{
          title: 'Anak',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progres"
        options={{
          title: 'Progres',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="akun"
        options={{
          title: 'Akun',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={size + 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
