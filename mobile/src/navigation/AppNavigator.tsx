import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CaretakerProfileScreen from '../screens/CaretakerProfileScreen';
import BookingScreen from '../screens/BookingScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: 20 }}>{name === 'Home' ? '🏠' : name === 'Chat' ? '💬' : '👤'}</Text>
    <Text style={{ fontSize: 10, color: focused ? '#0D9488' : '#94A3B8' }}>{name}</Text>
  </View>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { height: 60, paddingBottom: 8 },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatListScreen}
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => <TabIcon name="Chat" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <Text style={{ fontSize: 24, color: '#0D9488', fontWeight: 'bold' }}>CareTaker</Text>
        <Text style={{ color: '#94A3B8', marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="CaretakerProfile"
            component={CaretakerProfileScreen}
            options={{
              headerShown: true,
              title: 'Caretaker Profile',
              headerTintColor: '#0D9488',
            }}
          />
          <Stack.Screen
            name="Booking"
            component={BookingScreen}
            options={{
              headerShown: true,
              title: 'Book Appointment',
              headerTintColor: '#0D9488',
            }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              headerShown: true,
              title: 'Chat',
              headerTintColor: '#0D9488',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
