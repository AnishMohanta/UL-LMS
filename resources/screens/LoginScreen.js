import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   const [role, setRole] = useState('Student');

    const validateEmail = (email) => {
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(email);
    }

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        return regex.test(password);
    }

    const handleLogin = () => {
        // if (!validateEmail(email)) {
        //     Alert.alert('Invalid Email', 'Please enter a valid email address');
        //     return;
        // }
        // if (!validatePassword(password)) {
        //     Alert.alert('Invalid Password', 'Password must contain at least 1 uppercase, 1 lowercase, and 1 number');
        //     return;
        // }

if (role === 'Instructor') {
  navigation.navigate('AppStack', {
    screen: 'InstructorStack',
    params: { screen: 'InstructorDashboard' },
  });
} else {
  navigation.navigate('AppStack', {
    screen: 'StudentDashboard',
  });
}
    }

    return (
        <LinearGradient
            colors={['#E0F7FA', '#6200EE']}
            style={styles.container}
        >
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
    underlineColorAndroid="transparent" // remove Android default underline
/>

<TextInput
    placeholder="Password"
    placeholderTextColor="#666"
    secureTextEntry
    style={styles.input}
    value={password}
    onChangeText={setPassword}
    underlineColorAndroid="transparent"
/>
                {/* Role Toggle Buttons */}
                <View style={styles.roleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            role === 'Student' && styles.activeRoleButton
                        ]}
                        onPress={() => setRole('Student')}
                    >
                        <Text
                            style={[
                                styles.roleText,
                                role === 'Student' && styles.activeRoleText
                            ]}
                        >
                            Student
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            role === 'Instructor' && styles.activeRoleButton
                        ]}
                        onPress={() => setRole('Instructor')}
                    >
                        <Text
                            style={[
                                styles.roleText,
                                role === 'Instructor' && styles.activeRoleText
                            ]}
                        >
                            Instructor
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>Don't have an account? Register Now</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleContainer: {
        width: '80%',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 40,
    },
input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,          // extra rounded "capsule"
    backgroundColor: '#fff',   // solid white for clarity
    fontSize: 16,
    borderWidth: 1,            // clean thin border
    borderColor: '#ddd',
    marginBottom: 15,
},
      roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15
    },
    roleButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 5,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.6)',
        alignItems: 'center',
        elevation: 3
    },
    activeRoleButton: {
        backgroundColor: '#6200EE'
    },
    roleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    activeRoleText: {
        color: '#fff'
    },
   
    loginButton: {
        backgroundColor: '#6200EE',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 50,
        marginBottom: 20,

        // Android elevation
        elevation: 5,

        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    loginText: {
        color: '#ffffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerText: {
        color: '#fff',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});