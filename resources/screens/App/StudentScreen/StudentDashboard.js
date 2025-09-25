import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const StudentDashboard = ({ navigation }) => {
  return (

    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Dashboard"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text>Welcome to the Home Screen!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StudentDashboard;