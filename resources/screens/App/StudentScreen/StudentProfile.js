


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   StatusBar,
//   Platform,
//   Alert,
// } from 'react-native';
// import { BlurView } from '@react-native-community/blur';
// import LinearGradient from 'react-native-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-toast-message';
// import { useAuth } from '../../../navigations';
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// const StudentProfile = ({ navigation }) => {
//   const { setUserToken } = useAuth();
//   const [userName, setUserName] = useState('');
//   const [userEmail, setUserEmail] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const name = await AsyncStorage.getItem('userName');
//         const email = await AsyncStorage.getItem('userEmail');
//         if (name) setUserName(name);
//         if (email) setUserEmail(email);
//       } catch (error) {
//         Toast.show({
//           type: 'error',
//           text1: 'Error loading profile ⚠️',
//           text2: 'Unable to load your data. Please try again later.',
//         });
//       }
//     };
//     fetchUserData();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.clear();
//       setUserToken(null);
//       Toast.show({
//         type: 'success',
//         text1: 'Logged out 👋',
//         text2: 'You have been successfully logged out.',
//       });
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Logout Failed ❌',
//         text2: 'Something went wrong, please try again.',
//       });
//     }
//   };

//   const confirmLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Do you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Yes', onPress: handleLogout, style: 'destructive' },
//       ],
//       { cancelable: true }
//     );
//   };

//   return (
//     <LinearGradient
//       colors={['#E0F7FA', 'rgba(15, 35, 61, 1)']}
//       style={styles.container}
//     >
//       <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

//       {/* Top Section */}
//       <View style={styles.header}>
//         <Image
//           source={{
//             uri: 'https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU=',
//           }}
//           style={styles.profilePic}
//         />
//         <Text style={styles.userName}>{userName || 'User'}</Text>
//         <Text style={styles.role}>Student</Text>
//       </View>

//       {/* Glass Info Card */}
//       <View style={styles.glassCard}>
//         {Platform.OS === 'ios' && (
//           <BlurView
//             style={StyleSheet.absoluteFill}
//             blurType="light"
//             blurAmount={25}
//             reducedTransparencyFallbackColor="rgba(255,255,255,0.1)"
//           />
//         )}
//         <View style={styles.infoSection}>
//           <Text style={styles.label}>Email</Text>
//           <Text style={styles.value}>{userEmail || 'user@example.com'}</Text>
//         </View>

//         <View style={styles.divider} />

//         <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );
// };

// export default StudentProfile;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     paddingTop: verticalScale(70),
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: verticalScale(40),
//   },
//   profilePic: {
//     width: scale(120),
//     height: scale(120),
//     borderRadius: scale(60),
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.7)',
//     marginBottom: verticalScale(15),
//   },
//   userName: {
//     fontSize: moderateScale(22),
//     fontWeight: '700',
//     color: '#fff',
//     letterSpacing: 0.5,
//   },
//   role: {
//     fontSize: moderateScale(14),
//     color: '#fff',
//     marginTop: verticalScale(3),
//   },
//   glassCard: {
//     width: '85%',
//     paddingVertical: verticalScale(25),
//     paddingHorizontal: scale(20),
//     borderRadius: moderateScale(20),
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.3)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: verticalScale(6) },
//     shadowOpacity: 0.15,
//     shadowRadius: moderateScale(12),
//     elevation: 8,
//   },
//   infoSection: {
//     alignItems: 'center',
//     marginBottom: verticalScale(15),
//   },
//   label: {
//     fontSize: moderateScale(13),
//     color: '#fff',
//     marginBottom: verticalScale(3),
//   },
//   value: {
//     fontSize: moderateScale(16),
//     color: '#fff',
//     fontWeight: '500',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     marginVertical: verticalScale(20),
//   },
//   logoutButton: {
//     backgroundColor: 'rgba(255,77,77,0.9)',
//     paddingVertical: verticalScale(12),
//     borderRadius: moderateScale(25),
//     alignItems: 'center',
//     shadowColor: '#ff4d4d',
//     shadowOffset: { width: 0, height: verticalScale(4) },
//     shadowOpacity: 0.4,
//     shadowRadius: moderateScale(8),
//     elevation: 6,
//   },
//   logoutText: {
//     color: '#fff',
//     fontSize: moderateScale(16),
//     fontWeight: '600',
//   },
// });



import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../../navigations';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { BlurView } from '@react-native-community/blur';

const StudentProfile = ({ navigation }) => {
  const { setUserToken } = useAuth();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('userEmail');
        if (name) setUserName(name);
        if (email) setUserEmail(email);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error loading profile ⚠️',
          text2: 'Unable to load your data. Please try again later.',
        });
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setUserToken(null);
      Toast.show({
        type: 'success',
        text1: 'Logged out 👋',
        text2: 'You have been successfully logged out.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout Failed ❌',
        text2: 'Something went wrong, please try again.',
      });
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Do you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: handleLogout, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  return (
    <LinearGradient
      colors={['#E0F7FA', 'rgba(15, 35, 61, 1)']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: 'https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU=',
          }}
          style={styles.profilePic}
        />
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        {Platform.OS === 'ios' && (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="rgba(255,255,255,0.95)"
          />
        )}

        <View style={styles.infoItem}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{userName || 'User'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>Student</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userEmail || 'user@example.com'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default StudentProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: verticalScale(70),
  },
  profileContainer: {
    marginBottom: verticalScale(30),
    alignItems: 'center',
  },
  profilePic: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  infoCard: {
    width: '85%',
    backgroundColor: '#fdfdfd',
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(25),
    paddingHorizontal: scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(6) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(12),
    elevation: 10,
    alignItems: 'center',
  },
  infoItem: {
    width: '100%',
    marginBottom: verticalScale(15),
  },
  label: {
    fontSize: moderateScale(13),
    color: '#888',
    marginBottom: verticalScale(3),
  },
  value: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111',
  },
  logoutButton: {
    marginTop: verticalScale(15),
    width: '60%',
    backgroundColor: 'rgba(255,77,77,0.9)',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(25),
    alignItems: 'center',
    shadowColor: '#ff4d4d',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(8),
    elevation: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});