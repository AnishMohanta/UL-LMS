import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../../components/CustomHeader';

export default function StudentProfile({ navigation }) {
const handleLogout = () => {
  navigation.getParent()?.reset({
    index: 0,
    routes: [{ name: 'Auth' }], // reset root navigator to AuthStack
  });
};

  return (
    <SafeAreaView style={styles.container}>
      
      <CustomHeader title="Profile" onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        {/* Profile Picture */}
        <Image
          source={{
            uri: 'https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU=',
          }}
          style={styles.profilePic}
        />

        <Text style={styles.userName}>Anish</Text>
        {/* Email */}
        <Text style={styles.email}>user@example.com</Text>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6a11cb', // gradient background can be added later
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 20,
  },
  email: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
  },
  userName: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation:5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});