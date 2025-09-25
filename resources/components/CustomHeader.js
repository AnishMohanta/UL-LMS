import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomHeader = ({ title, onBackPress }) => {
  return (
    <View style={styles.container}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress} style={styles.leftIcon}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={styles.leftIcon} /> // Empty space if no back button
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightIcon} /> {/* Keep spacing balanced */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#6200EE', // Customize your color
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  leftIcon: {
    width: 40,
  },
  rightIcon: {
    width: 40, // Keep same width for alignment
  },
});

export default CustomHeader;