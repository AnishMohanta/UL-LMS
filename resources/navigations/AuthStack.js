// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import SplashScreen from '../screens/SplashScreen';
// import LoginScreen from '../screens/LoginScreen';
// import ProfileCreation from '../screens/ProfileCreation';


// export type AuthStackParamList = {
//   SplashScreen: undefined;
//   Login: undefined;
//   ProfileCreation: undefined;
// };


// const Stack = createStackNavigator<AuthStackParamList>();


// const AuthStack: React.FC = () => {
//   return (
//     <Stack.Navigator initialRouteName="SplashScreen">
//       <Stack.Screen
//         name="SplashScreen"
//         component={SplashScreen}
//         options={{ headerShown: false}}
//       />
//       <Stack.Screen
//         name="Login"
//         component={LoginScreen}
//         options={{ headerShown: false}}
//       />
//       <Stack.Screen
//         name="ProfileCreation"
//         component={ProfileCreation}
//         options={{ headerShown: false}}
//       />
//     </Stack.Navigator>
//   );
// };

// export default AuthStack;



import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileCreation from '../screens/ProfileCreation';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileCreation"
        component={ProfileCreation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;