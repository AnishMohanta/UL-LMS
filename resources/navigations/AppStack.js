// import React, { useEffect, useState } from 'react';
// import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
// import StudentStack from './StudentNavigation/StudentStack';
// import InstructorStack from './InstructorNavigation/InstructorStack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ActivityIndicator, View } from 'react-native';


// export type AppStackParamList = {
//   StudentStack: undefined;
//   InstructorStack: undefined;
// };

// const Stack = createNativeStackNavigator<AppStackParamList>();


// const AppStack: React.FC = () => {
//   const [role, setRole] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getRole = async () => {
//       try {
//         const savedRole = await AsyncStorage.getItem('userRole');
//         setRole(savedRole);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getRole();
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   const screenOptions: NativeStackNavigationOptions = { headerShown: false };

//   return (
//     <Stack.Navigator screenOptions={screenOptions}>
//       {role === 'Instructor' ? (
//         <Stack.Screen name="InstructorStack" component={InstructorStack} />
//       ) : (
//         <Stack.Screen name="StudentStack" component={StudentStack} />
//       )}
//     </Stack.Navigator>
//   );
// };

// export default AppStack;




import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentStack from './StudentNavigation/StudentStack';
import InstructorStack from './InstructorNavigation/InstructorStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRole = async () => {
      try {
        const savedRole = await AsyncStorage.getItem('userRole');
        setRole(savedRole);
      } finally {
        setLoading(false);
      }
    };
    getRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const screenOptions = { headerShown: false };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {role === 'Instructor' ? (
        <Stack.Screen name="InstructorStack" component={InstructorStack} />
      ) : (
        <Stack.Screen name="StudentStack" component={StudentStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppStack;