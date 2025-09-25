import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from "./AuthStack"
import AppStack from "./AppStack"

const RootStack = createStackNavigator();
const Navigation = () => {
  return (
   <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name='Auth' component={AuthStack} />
          <RootStack.Screen name='AppStack' component={AppStack} />
  
        </RootStack.Navigator>
      </NavigationContainer>
  )
}

export default Navigation