// // 


// import React, { useEffect, useState, createContext, useContext } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator, } from '@react-navigation/stack';
// import AuthStack from './AuthStack';
// import AppStack from './AppStack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ActivityIndicator, View } from 'react-native';


// export type RootStackParamList = {
//   Auth: undefined;
//   AppStack: undefined;
// };


// const RootStack = createStackNavigator<RootStackParamList>();


// interface AuthContextType {
//   userToken: string | null;
//   setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
// }


// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthContext.Provider');
//   }
//   return context;
// };

// const Navigation: React.FC = () => {
//   const [loading, setLoading] = useState(true);
//   const [userToken, setUserToken] = useState<string | null>(null);

//   const authContextValue: AuthContextType = {
//     userToken,
//     setUserToken,
//   };

//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         setUserToken(token);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkToken();
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <AuthContext.Provider value={authContextValue}>
//       <NavigationContainer>
//         <RootStack.Navigator screenOptions={{ headerShown: false }}>
//           {userToken ? (
//             <RootStack.Screen name="AppStack" component={AppStack} />
//           ) : (
//             <RootStack.Screen name="Auth" component={AuthStack} />
//           )}
//         </RootStack.Navigator>
//       </NavigationContainer>
//     </AuthContext.Provider>
//   );
// };

// export default Navigation;



import React, { useEffect, useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

const RootStack = createStackNavigator();

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContext.Provider');
  }
  return context;
};

const Navigation = () => {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const authContextValue = {
    userToken,
    setUserToken,
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {userToken ? (
            <RootStack.Screen name="AppStack" component={AppStack} />
          ) : (
            <RootStack.Screen name="Auth" component={AuthStack} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default Navigation;