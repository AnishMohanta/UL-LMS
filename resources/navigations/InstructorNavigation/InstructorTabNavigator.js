import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InstructorDashboard from "../../screens/App/InstructorScreen/InstructorDashboard";
import Ionicons from "react-native-vector-icons/Ionicons";
import CoursesScreen from "../../screens/App/InstructorScreen/CoursesScreen";
import StudentsScreen from "../../screens/App/InstructorScreen/StudentsScreen";
import ProfileScreen from "../../screens/App/InstructorScreen/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function InstructorTabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "home-outline";
          } else if (route.name === "Courses") {
            iconName = "book-outline";
          } else if (route.name === "Students") {
            iconName = "people-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: '#09203F', // active tab color
        tabBarInactiveTintColor: "gray",    // inactive tab color
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Students" component={StudentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
