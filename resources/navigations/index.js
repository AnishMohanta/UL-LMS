import React, { useEffect, useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

const RootStack = createStackNavigator();


export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const Navigation = () => {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const authContextValue = {
    userToken,
    setUserToken,
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
      setLoading(false);
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