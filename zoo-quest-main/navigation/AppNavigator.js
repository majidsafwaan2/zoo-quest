import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome5 } from '@expo/vector-icons';
import CustomTabBar from '../components/CustomTabBar';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import EncyclopediaScreen from '../screens/EncyclopediaScreen';
import AnimalDetailScreen from '../screens/AnimalDetailScreen';
import QuestScreen from '../screens/QuestScreen';
import HabitatScreen from '../screens/HabitatScreen';
import HabitatDetailScreen from '../screens/HabitatDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ConservationImpactScreen from '../screens/ConservationImpactScreen';
import ConservationActionsScreen from '../screens/ConservationActionsScreen';
import HomeDashboard from '../screens/HomeDashboard';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create the Conservation Stack
function ConservationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConservationImpact" component={ConservationImpactScreen} />
      <Stack.Screen name="ConservationActions" component={ConservationActionsScreen} />
    </Stack.Navigator>
  );
}

// Create the Habitat Stack
function HabitatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HabitatList" component={HabitatScreen} />
      <Stack.Screen name="HabitatDetail" component={HabitatDetailScreen} />
    </Stack.Navigator>
  );
}

// Create the Encyclopedia Stack
function EncyclopediaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EncyclopediaHome" component={EncyclopediaScreen} />
      <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} />
    </Stack.Navigator>
  );
}

// Update the Home Stack to include HomeScreen
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={HomeDashboard} />
      <Stack.Screen name="AnimalChat" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} />
    </Stack.Navigator>
  );
}

// Main app navigator with tabs
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2f6b47',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
        }
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Encyclopedia" 
        component={EncyclopediaStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Habitat" 
        component={HabitatStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="mountain" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Conservation" 
        component={ConservationStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="leaf" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
} 