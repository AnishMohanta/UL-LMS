// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import StudentDashboard from '../../screens/App/StudentScreen/StudentDashboard';
// import StudentAllCourses from '../../screens/App/StudentScreen/StudentAllCourses';
// import StudentProfile from '../../screens/App/StudentScreen/StudentProfile';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { RouteProp } from '@react-navigation/native';


// export type StudentTabParamList = {
//   Dashboard: undefined;
//   AllCourses: undefined;
//   Profile: undefined;
// };

// const Tab = createBottomTabNavigator<StudentTabParamList>();

// const StudentTabNavigator: React.FC = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarShowLabel: true,
//         tabBarActiveTintColor: "rgba(15, 35, 61, 1)",
//         tabBarInactiveTintColor: 'gray',
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName: string;

//           switch (route.name) {
//             case 'Dashboard':
//               iconName = 'home-outline';
//               break;
//             case 'AllCourses':
//               iconName = 'book-outline';
//               break;
//             case 'Profile':
//               iconName = 'person-outline';
//               break;
//             default:
//               iconName = 'ellipse-outline'; 
//           }

//           return <Ionicons name={iconName} size={size ?? 26} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Dashboard" component={StudentDashboard} />
//       <Tab.Screen name="AllCourses" component={StudentAllCourses} />
//       <Tab.Screen name="Profile" component={StudentProfile} />
//     </Tab.Navigator>
//   );
// };

// export default StudentTabNavigator;


import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentDashboard from '../../screens/App/StudentScreen/StudentDashboard';
import StudentAllCourses from '../../screens/App/StudentScreen/StudentAllCourses';
import StudentProfile from '../../screens/App/StudentScreen/StudentProfile';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const StudentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "rgba(15, 35, 61, 1)",
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'home-outline';
              break;
            case 'AllCourses':
              iconName = 'book-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size ?? 26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={StudentDashboard} />
      <Tab.Screen name="AllCourses" component={StudentAllCourses} />
      <Tab.Screen name="Profile" component={StudentProfile} />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;