;import { View, Text } from 'react-native'
import React from 'react'
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navigation from './resources/navigations/index'






export default function App() {

  return (
    <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <Navigation />
     
    </SafeAreaProvider>
  )
}

