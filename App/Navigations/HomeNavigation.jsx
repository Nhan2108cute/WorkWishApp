import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen/HomeScreen';
import BusinessDetailsScreen from '../Screens/BusinessDetailsScreen/BusinessDetailsScreen';

const Stack = createStackNavigator();
export default function HomeNavigation() {
  return (
    <Stack.Navigator>
        <Stack.Screen name='home' component={HomeScreen}/>
        <Stack.Screen name='business-details' component={BusinessDetailsScreen}/>
    </Stack.Navigator>
  )
}