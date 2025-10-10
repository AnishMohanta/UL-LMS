import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InstructorTabNavigation from "./InstructorTabNavigator";

// import your course-related screens
import CoursesScreen from "../../screens/App/InstructorScreen/CoursesScreen";
import CourseDetailsScreen from "../../screens/App/InstructorScreen/CourseDetailsScreen";
import CreateCourseScreen from "../../screens/App/InstructorScreen/CreateCourseScreen";

const Stack = createNativeStackNavigator();

const InstructorStack = () => {
  return (
    <Stack.Navigator>
      {/* Main Tab Navigation (Dashboard, etc.) */}
      <Stack.Screen
        name="InstructorTab"
        component={InstructorTabNavigation}
        options={{ headerShown: false }}
      />
      {/* Course details */}
      <Stack.Screen
        name="CourseDetails"
        component={CourseDetailsScreen}
        options={{
          title: "Course Details",
          headerShown: true,
        }}
      />

      {/* Create new course */}
      <Stack.Screen
        name="CreateCourse"
        component={CreateCourseScreen}
        options={{
          title: "Create Course",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default InstructorStack;
