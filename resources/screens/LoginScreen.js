



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   StatusBar,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useAuth } from '../navigations/index';
// import { login_url } from '../api/ApiEndPoints';
// import Toast from 'react-native-toast-message';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('Student'); 
//   const [loading, setLoading] = useState(false);


//   const { setUserToken } = useAuth();

//   const handleLogin = async () => {
//     // Basic validation
//     const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

//     if (!email || !password) {
//        Toast.show({
//         type: 'error',
//         text1: 'Missing Fields',
//         text2: 'Please fill in both email and password.',
//       });
//       return;
//     }

//     if (!emailRegex.test(email)) {
//          Toast.show({
//         type: 'error',
//         text1: 'Invalid Email',
//         text2: 'Please enter a valid email address.',
//       });
//       return;
//     }

//     if (!passwordRegex.test(password)) {
//        Toast.show({
//         type: 'error',
//         text1: 'Invalid Password',
//         text2: 'Password must include 1 uppercase, 1 lowercase, 1 number, and be 6+ characters long.',
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post(login_url, { email, password });
//       const { success, data, message } = response.data;

//       if (!success) {
//        Toast.show({
//           type: 'error',
//           text1: 'Login Failed',
//           text2: message || 'Invalid credentials. Please try again.',
//         });
//         return;
//       }

//       // Role validation
//       if (data.role !== role) {
//            Toast.show({
//           type: 'error',
//           text1: 'Role Mismatch',
//           text2: `You selected ${role}, but your account is ${data.role}.`,
//         });
//         return;
//       }

//       // Save user data in AsyncStorage
//       await AsyncStorage.setItem('userToken', data.token);
//       await AsyncStorage.setItem('userRole', data.role);
//       await AsyncStorage.setItem('userName', data.name);
//       await AsyncStorage.setItem('userEmail', data.email);

//       // Update context
//       setUserToken(data.token);
//         Toast.show({
//         type: 'success',
//         text1: 'Login Successful 🎉',
//         text2: `Welcome back, ${data.name}!`,
//       });
//     } catch (error) {
//     Toast.show({
//         type: 'error',
//         text1: 'Login Failed',
//         text2: error.response?.data?.message || 'Something went wrong. Please try again.',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient colors={['#E0F7FA', 'rgba(15, 35, 61, 1)']} style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
//       <View style={styles.middleContainer}>
//         <Text style={styles.title}>UL LMS</Text>

//         {/* Email Input */}
//         <TextInput
//           placeholder="Email"
//           placeholderTextColor="#666"
//           keyboardType="email-address"
//           autoCapitalize="none"
//           style={styles.input}
//           value={email}
//           onChangeText={setEmail}
//         />

//         {/* Password Input */}
//         <TextInput
//           placeholder="Password"
//           placeholderTextColor="#666"
//           secureTextEntry
//           style={styles.input}
//           value={password}
//           onChangeText={setPassword}
//         />


//         {/* Role Selection */}
//         <View style={styles.roleContainer}>
//           <TouchableOpacity
//             style={[styles.roleButton, role === 'Student' && styles.activeRoleButton]}
//             onPress={() => setRole('Student')}
//           >
//             <Text style={[styles.roleText, role === 'Student' && styles.activeRoleText]}>
//               Student
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.roleButton, role === 'Instructor' && styles.activeRoleButton]}
//             onPress={() => setRole('Instructor')}
//           >
//             <Text style={[styles.roleText, role === 'Instructor' && styles.activeRoleText]}>
//               Instructor
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Login Button */}
//         <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//           {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Login</Text>}
//         </TouchableOpacity>

//         {/* Register Navigation */}
//         <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//           <Text style={styles.registerText}>Don't have an account? Register Now</Text>
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );
// };

// export default LoginScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   middleContainer: { width: '80%', alignItems: 'center' },
//   title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 40 },
//   input: {
//     width: '100%',
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderRadius: 15,
//     backgroundColor: '#fff',
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginBottom: 15,
//   },
//   roleContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15 },
//   roleButton: {
//     flex: 1,
//     paddingVertical: 12,
//     marginHorizontal: 5,
//     borderRadius: 25,
//     backgroundColor: 'rgba(255,255,255,0.6)',
//     alignItems: 'center',
//     elevation: 3,
//   },
//   activeRoleButton: { backgroundColor: 'rgba(15, 35, 61, 1)' },
//   roleText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//   activeRoleText: { color: '#fff' },
//   loginButton: {
//     backgroundColor: 'rgba(15, 35, 61, 1)',
//     paddingVertical: 15,
//     paddingHorizontal: 60,
//     borderRadius: 50,
//     marginBottom: 20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   loginText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   registerText: { color: '#fff', fontSize: 14, textDecorationLine: 'underline' },
// });



import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useAuth } from '../navigations/index';
import { login_url } from '../api/ApiEndPoints';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain uppercase, lowercase, number & special character'
    )
    .required('Password is required'),
  role: Yup.string().required('Role is required'),
});

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { setUserToken } = useAuth();

  const handleLogin = async (values) => {
    const { email, password, role } = values;
    try {
      setLoading(true);
      const response = await axios.post(login_url, { email, password });
      const { success, data, message } = response.data;

      if (!success) {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: message || 'Invalid credentials.',
        });
        return;
      }

      if (data.role !== role) {
        Toast.show({
          type: 'error',
          text1: 'Role Mismatch',
          text2: `You selected ${role}, but your account is ${data.role}.`,
        });
        return;
      }

      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userRole', data.role);
      await AsyncStorage.setItem('userName', data.name);
      await AsyncStorage.setItem('userEmail', data.email);

      setUserToken(data.token);

      Toast.show({
        type: 'success',
        text1: 'Login Successful 🎉',
        text2: `Welcome back, ${data.name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#E0F7FA', 'rgba(15, 35, 61, 1)']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <Formik
        initialValues={{ email: '', password: '', role: 'Student' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.middleContainer}>
            <Text style={styles.title}>UL LMS</Text>

            {/* Email Input */}
            <TextInput
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {/* Password Input */}
            <TextInput
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry
              style={styles.input}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            />
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Role Selector */}
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleButton, values.role === 'Student' && styles.activeRoleButton]}
                onPress={() => setFieldValue('role', 'Student')}
              >
                <Text style={[styles.roleText, values.role === 'Student' && styles.activeRoleText]}>
                  Student
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleButton, values.role === 'Instructor' && styles.activeRoleButton]}
                onPress={() => setFieldValue('role', 'Instructor')}
              >
                <Text
                  style={[styles.roleText, values.role === 'Instructor' && styles.activeRoleText]}
                >
                  Instructor
                </Text>
              </TouchableOpacity>
            </View>
            {errors.role && touched.role && <Text style={styles.errorText}>{errors.role}</Text>}

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Register Redirect */}
            <View style={styles.btnGroup}>
              <Text style={styles.subHeading1}>Do not have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ProfileCreation')}>
                <Text style={styles.subHeading2}> Register Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  middleContainer: { width: '85%', alignItems: 'center' },

  title: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: moderateVerticalScale(40),
  },
  input: {
    width: '100%',
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(15),
    backgroundColor: '#fff',
    fontSize: moderateScale(16),
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: moderateVerticalScale(10),
  },
  errorText: {
    color: 'red',
    fontSize: moderateScale(12),
    marginBottom: moderateVerticalScale(8),
    alignSelf: 'flex-start',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: moderateVerticalScale(15),
  },
  roleButton: {
    flex: 1,
    paddingVertical: verticalScale(12),
    marginHorizontal: moderateScale(5),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    elevation: 3,
  },
  activeRoleButton: { backgroundColor: 'rgba(15, 35, 61, 1)' },
  roleText: { fontSize: moderateScale(16), fontWeight: 'bold', color: '#333' },
  activeRoleText: { color: '#fff' },
  loginButton: {
    backgroundColor: 'rgba(15, 35, 61, 1)',
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(50),
    borderRadius: moderateScale(50),
    marginBottom: moderateVerticalScale(20),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginText: { color: '#fff', fontSize: moderateScale(16), fontWeight: 'bold' },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
 subHeading1: {
    fontSize: moderateScale(13),
    color: 'white',
  },
  subHeading2: {
    fontSize: moderateScale(13),
    color: 'white',
    fontWeight: 'bold',
  },
});