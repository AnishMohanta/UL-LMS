// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import StudentTabNavigator from './StudentTabNavigator'; // your tab navigator
// import StudentLessons from '../../screens/App/StudentScreen/StudentLessons';


// export type StudentStackParamList = {
//   StudentTabs: undefined;
//   StudentLessons: undefined; // if you need params, add them here
// };

// const Stack = createNativeStackNavigator<StudentStackParamList>();


// const StudentStack: React.FC = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{ headerShown: false }}
//       initialRouteName="StudentTabs"
//     >
//       {/* Root tab navigator */}
//       <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
      
//       {/* Extra screens */}
//       <Stack.Screen name="StudentLessons" component={StudentLessons} />
//     </Stack.Navigator>
//   );
// };

// export default StudentStack;


import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentTabNavigator from './StudentTabNavigator'; // your tab navigator
import StudentLessons from '../../screens/App/StudentScreen/StudentLessons';

const Stack = createNativeStackNavigator();

const StudentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="StudentTabs"
    >
      {/* Root tab navigator */}
      <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
      
      {/* Extra screens */}
      <Stack.Screen name="StudentLessons" component={StudentLessons} />
    </Stack.Navigator>
  );
};

export default StudentStack;