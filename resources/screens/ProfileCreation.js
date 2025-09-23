import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileCreation = () => {
  return (
       <SafeAreaView style={styles.container}>
      <Text>ProfileCreation</Text>
   </SafeAreaView>
  )
}

export default ProfileCreation

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
})