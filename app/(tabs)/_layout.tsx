import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { HomeIcon, PaymentsIcon, OfflineIcon, ProfileIcon } from '../../components/Icons';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const color = focused ? '#0066FF' : '#9CA3AF';
  
  switch (name) {
    case 'home':
      return <HomeIcon size={24} color={color} />;
    case 'payments':
      return <PaymentsIcon size={24} color={color} />;
    case 'offline':
      return <OfflineIcon size={24} color={color} />;
    case 'profile':
      return <ProfileIcon size={24} color={color} />;
    default:
      return null;
  }
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#0066FF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          tabBarIcon: ({ focused }) => <TabIcon name="payments" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="offline"
        options={{
          title: 'Offline',
          tabBarIcon: ({ focused }) => <TabIcon name="offline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    height: 85,
    paddingTop: 10,
    paddingBottom: 25,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
