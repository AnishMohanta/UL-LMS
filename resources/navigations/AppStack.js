import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import StudentStack from "./StudentNavigation/StudentStack"
import InstructorDashboard from "../screens/App/InstructorScreen/InstructorDashboard"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InstructorStack from "./InstructorNavigation/InstructorStack"

//  const Stack = createStackNavigator();
 const Stack = createNativeStackNavigator();
const AppStack = () => {
   
  return (
 <Stack.Navigator >
  <Stack.Screen
    name='StudentStack'
    component={StudentStack}
    options={{ headerShown: false, navigationBarColor: "blue" }}
  />
  <Stack.Screen
    name='InstructorStack'
    component={InstructorStack}
    options={{ headerShown: false, navigationBarColor: "blue" }}
  />
 
</Stack.Navigator>
  )
}

export default AppStack 