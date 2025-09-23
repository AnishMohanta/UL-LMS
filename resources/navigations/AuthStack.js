import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from "../screens/SplashScreen"
import LoginScreen from "../screens/LoginScreen"
import ProfileCreation from "../screens/ProfileCreation"

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
<Stack.Navigator initialRouteName='SplashScreen'>
  <Stack.Screen
    name='SplashScreen'
    component={SplashScreen}
    options={{ headerShown: false, navigationBarColor: "blue" }}
  />
  <Stack.Screen
    name='Login'
    component={LoginScreen}
    options={{ headerShown: false, navigationBarColor: "blue" }}
  />
  <Stack.Screen
    name='ProfileCreation'
    component={ProfileCreation}
    options={{ headerShown: false, navigationBarColor: "blue" }}
  />
</Stack.Navigator>
    )

}

export default AuthStack