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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 





const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      // 'Password must contain uppercase, lowercase, number & special character'
      /^(?=.*[a-z])(?=.*\d)/,
      'Password must contain lowercase & number'
    )
    .required('Password is required'),
  role: Yup.string().required('Role is required'),
});

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { setUserToken } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);

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

            {/* <TextInput
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry
              style={styles.input}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
            /> */}


            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#666"
                secureTextEntry={!passwordVisible}
                style={[styles.input, { paddingRight: moderateScale(40) }]}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Icon
                  name={passwordVisible ? 'eye-off' : 'eye'}
                  size={moderateScale(20)}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}


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


            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </TouchableOpacity>


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
  passwordContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: moderateVerticalScale(10),
  },
  eyeIcon: {
    position: 'absolute',
    right: moderateScale(10),
    top: verticalScale(14),
  },
});