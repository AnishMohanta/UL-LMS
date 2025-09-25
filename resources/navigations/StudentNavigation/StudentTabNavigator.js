import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentDashboard from '../../screens/App/StudentScreen/StudentDashboard';
import StudentAllCourses from '../../screens/App/StudentScreen/StudentAllCourses';
import StudentProfile from '../../screens/App/StudentScreen/StudentProfile';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function StudentTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#6200EE',   // active icon color
        tabBarInactiveTintColor: 'gray', // inactive icon color
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home-outline';
          } else if (route.name === 'AllCourses') {
            iconName = 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={26} // fixed size
              color={focused ? '#6200EE' : 'gray'} // fixed colors
            />
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={StudentDashboard} />
      <Tab.Screen name="AllCourses" component={StudentAllCourses} />
      <Tab.Screen name="Profile" component={StudentProfile} />
    </Tab.Navigator>
  );
}