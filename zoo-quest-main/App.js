import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import QuickAccessButton from './components/QuickAccessButton';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import EncyclopediaScreen from './screens/EncyclopediaScreen';
import ConservationImpactScreen from './screens/ConservationImpactScreen';
import AnimalDetailScreen from './screens/AnimalDetailScreen';
import QuestScreen from './screens/QuestScreen';
import HabitatScreen from './screens/HabitatScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create individual stacks for each tab to handle nested navigation
function HomeStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#1d4e31' }
      }}
    >
      <Stack.Screen name="AnimalSelect" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function EncyclopediaStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#1d4e31' }
      }}
    >
      <Stack.Screen name="EncyclopediaHome" component={EncyclopediaScreen} />
      <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} />
      <Stack.Screen name="Habitat" component={HabitatScreen} />
    </Stack.Navigator>
  );
}

function ConservationStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#1d4e31' }
      }}
    >
      <Stack.Screen name="ConservationHome" component={ConservationImpactScreen} />
      <Stack.Screen name="QuestDetail" component={QuestScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#1d4e31' }
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="QuestList" component={QuestScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
        <QuickAccessButton />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
