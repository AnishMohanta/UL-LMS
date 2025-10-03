import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentTabNavigator from './StudentTabNavigator'; // your tab navigator
import StudentLessons from '../../screens/App/StudentScreen/StudentLessons'; // optional extra screen

const Stack = createNativeStackNavigator();

const StudentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="StudentTabs" // set the initial/root screen
    >
      {/* Root screen */}
      <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
      
      {/* Extra screens can go here */}
      <Stack.Screen name="StudentLessons" component={StudentLessons} />
    </Stack.Navigator>
  );
};

export default StudentStack;