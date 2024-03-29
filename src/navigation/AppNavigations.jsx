import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home';
import Setting from '../screens/Setting';

const AppNavigations = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
        <Stack.Screen name='home' component={Home} />
        <Stack.Screen name='setting' component={Setting} />
    </Stack.Navigator>
  )
}

export default AppNavigations