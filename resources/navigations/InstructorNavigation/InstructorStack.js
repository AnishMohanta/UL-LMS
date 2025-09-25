import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import StudentDashboard from "../../screens/App/StudentScreen/StudentDashboard"
import InstructorDashboard from "../../screens/App/InstructorScreen/InstructorDashboard"
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//  const Stack = createStackNavigator();
 const Stack = createNativeStackNavigator();
const InstructorStack = () => {
   
  return (
 <Stack.Navigator >
 
  <Stack.Screen
    name='InstructorDashboard'
    component={InstructorDashboard}
    options={{ headerShown: false, navigationBarColor: "blue" }}
  />
 
</Stack.Navigator>
  )
}

export default InstructorStack