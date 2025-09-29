import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InstructorTabNavigation from "./InstructorTabNavigator";

const Stack = createNativeStackNavigator();

const InstructorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InstructorTab"
        component={InstructorTabNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default InstructorStack;
