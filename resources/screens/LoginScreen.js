import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useAuth } from "../navigations/index"
import {login_url} from "../api/ApiEndPoints"

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [loading, setLoading] = useState(false);

    const { setUserToken } = useAuth();

const handleLogin = async () => {
    // Basic validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!email || !password) {
        Alert.alert('Error', 'Please fill all fields');
        return;
    }

    if (!emailRegex.test(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
    }

    if (!passwordRegex.test(password)) {
        Alert.alert(
            'Invalid Password',
            'Password must be at least 6 characters long and contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
        );
        return;
    }

    // If validation passes, continue with login
    try {
        setLoading(true);
        const response = await axios.post(login_url,
            { email, password }
        );
        const data = response.data;

        if (data.role !== role) {
            Alert.alert(
                'Role Mismatch',
                `You selected ${role} but your account is ${data.role}`
            );
            setLoading(false);
            return;
        }

        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userRole', data.role);
        await AsyncStorage.setItem('userName', data.name);
        await AsyncStorage.setItem('userEmail', data.email);

        setUserToken(data.token); 
        setLoading(false);
    } catch (error) {
        Alert.alert(
            'Login Failed',
            error.response?.data?.message || 'Something went wrong'
        );
        setLoading(false);
    }
};

    return (
        <LinearGradient colors={['#E0F7FA', '#6200EE']} style={styles.container}>
            <View style={styles.middleContainer}>
                <Text style={styles.title}>UL LMS</Text>

                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#666"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Role Buttons */}
                <View style={styles.roleContainer}>
                    <TouchableOpacity
                        style={[styles.roleButton, role === 'Student' && styles.activeRoleButton]}
                        onPress={() => setRole('Student')}
                    >
                        <Text style={[styles.roleText, role === 'Student' && styles.activeRoleText]}>Student</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.roleButton, role === 'Instructor' && styles.activeRoleButton]}
                        onPress={() => setRole('Instructor')}
                    >
                        <Text style={[styles.roleText, role === 'Instructor' && styles.activeRoleText]}>Instructor</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Login</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>Don't have an account? Register Now</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  middleContainer: {
    width: '80%',
    alignItems: 'center',
  },

  // Title
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },

  // Inputs
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },

  // Role buttons container
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },

  // Role button
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    elevation: 3,
  },

  activeRoleButton: {
    backgroundColor: '#6200EE',
  },

  roleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  activeRoleText: {
    color: '#fff',
  },

  // Login button
  loginButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 50,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Register text
  registerText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});