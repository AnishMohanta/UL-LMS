import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ScaledSheet, moderateScale, verticalScale } from 'react-native-size-matters';

const SplashScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#E0F7FA', "rgba(15, 35, 61, 1)"]}
      style={styles.container}
    >
      
      <View style={styles.middleSection}>
        <Text style={styles.appName}>UL LMS</Text>
      </View>

      
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.8}
      >
        <Text style={styles.loginButtonText}>Go to Login</Text>
      </TouchableOpacity>

     
      <View style={styles.btnGroup}>
        <Text style={styles.subHeading1} allowFontScaling={true}>
          Do not have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileCreation')}>
          <Text style={styles.subHeading2}> Register Now</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: verticalScale(30), 
  },
  middleSection: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
  },
  appName: {
    fontSize: moderateScale(36),
    fontWeight: 'bold',
    color: 'white',
  },
  loginButton: {
    backgroundColor: "rgba(15, 35, 61, 1)",
    paddingVertical: verticalScale(15),
    paddingHorizontal: moderateScale(60),
    borderRadius: moderateScale(50),
    marginBottom: verticalScale(20),
    elevation: 5, 

  },
  loginButtonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
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