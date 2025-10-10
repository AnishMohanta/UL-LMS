


import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { all_courses_url, enrolled_coursesByid_url } from '../../../api/ApiEndPoints';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';

const StudentAllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const  isFocused = useIsFocused()

  const API_URL = all_courses_url;

  const fetchCourses = useCallback(
    async (pageNumber = 1, isRefresh = false) => {
      if (loading) return;
      try {
        if (!isRefresh) setLoading(true);

        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(
          `${API_URL}?page=${pageNumber}&limit=10&sortBy=createdAt&sortOrder=desc`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchedCourses = response?.data?.data?.data || [];
        const pagination = response?.data?.data?.pagination || {};

        setCourses((prev) => {
          const newList = isRefresh ? fetchedCourses : [...prev, ...fetchedCourses];
     
          const uniqueCourses = newList.filter(
            (course, index, self) =>
              index === self.findIndex((c) => c._id === course._id)
          );
          return uniqueCourses;
        });

        setHasNextPage(pagination.hasNextPage);
        setPage(pageNumber);

        if (isRefresh) {
          Toast.show({
            type: 'success',
            text1: 'Courses refreshed',
            text2: 'Course list updated successfully 🎉',
          });
        }
      } catch (error) {
        console.error('Error fetching courses:', error.message);
        Toast.show({
          type: 'error',
          text1: 'Failed to load courses',
          text2: 'Something went wrong',
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading, API_URL]
  );

  // useEffect(() => {
  //   fetchCourses(1);
  // }, [isFocused]);
  useEffect(() => {
  if (isFocused) {
    fetchCourses(1, true); 
  }
}, [isFocused]);

  const onRefresh = () => {
    // setHasNextPage(true);
    setRefreshing(true);
    fetchCourses(1, true);
  };

  const loadMore = () => {
    if (hasNextPage && !loading) {
      fetchCourses(page + 1);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Unauthorized', 'Please log in to enroll in a course.');
        return;
      }

      const response = await axios.post(
        enrolled_coursesByid_url,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Enrolled successfully 🎓',
          text2: 'You are now enrolled in this course!',
        });
        setCourses((prev) =>
          prev.map((c) => (c._id === courseId ? { ...c, enrollment: true } : c))
        );
      } else {
        Toast.show({
          type: 'error',
          text1: 'Enrollment failed',
          text2: 'Please try again later ',
        });
      }
    } catch (error) {
      console.error('Enroll error:', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Unable to enroll in this course.',
      });
    }
  };

  
// const renderCourseCard = ({ item }) => (
//   <View style={styles.card}>
//     <Image
//       source={{ uri: item.imageUrl }}
//       style={styles.thumbnail}
//       resizeMode="cover"
//     />
//     <View style={styles.cardContent}>
//       <Text style={styles.cardTitle}>{item.title}</Text>
//       <View style={styles.subjectCapsule}>
//         <Text style={styles.subjectText}>{item.category}</Text>
//       </View>
//       <Text style={styles.cardDescription}>{item.description}</Text>

//       <View style={styles.rowContainer}>
//         {item.isActive ? (
//           item.enrollment ? (
//             // Disabled "Enrolled" button
//             <View style={[styles.enrollButton, styles.disabledButton]}>
//               <Text style={styles.enrollButtonText}>Enrolled</Text>
//             </View>
//           ) : (
//             // Active "Enroll Now" button with confirmation
//             <TouchableOpacity
//               style={styles.enrollButton}
//               onPress={() => {
//                 Alert.alert(
//                   'Enroll Confirmation',
//                   'Do you want to enroll?',
//                   [
//                     { text: 'No', style: 'cancel' },
//                     { text: 'Yes', onPress: () => handleEnroll(item._id) },
//                   ],
//                   { cancelable: true }
//                 );
//               }}
//             >
//               <Text style={styles.enrollButtonText}>Enroll Now</Text>
//             </TouchableOpacity>
//           )
//         ) : (
//           <View style={{ width: scale(100) }} /> // Hide button if not active
//         )}

//         <Text
//           style={[
//             styles.statusText,
//             item.isActive ? styles.active : styles.inactive,
//           ]}
//         >
//           {item.isActive ? 'Active' : 'Not Active'}
//         </Text>
//       </View>
//     </View>
//   </View>
// );

const renderCourseCard = ({ item }) => {
  const isInactive = !item.isActive;

  return (
    <View style={[styles.card, isInactive && styles.inactiveCard]}>
      <Image
        source={{ uri: item.imageUrl }}
        style={[styles.thumbnail, isInactive ]}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, isInactive ]}>
          {item.title}
        </Text>

        <View style={[styles.subjectCapsule, isInactive ]}>
          <Text style={styles.subjectText}>{item.category}</Text>
        </View>
         <Text style={[styles.instructorText, isInactive && { color: '#aaa' }]}>
          By {item.instructor?.name}
        </Text>

        <Text style={[styles.cardDescription, isInactive]}>
          {item.description}
        </Text>

        {isInactive ? (
          <View style={styles.unavailableContainer}>
            <Text style={styles.unavailableText}>No longer available</Text>
          </View>
        ) : (
          <View style={styles.rowContainer}>
            {item.enrollment ? (
              <View style={[styles.enrollButton, styles.disabledButton]}>
                <Text style={styles.enrollButtonText}>Enrolled</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.enrollButton}
                onPress={() => {
                  Alert.alert(
                    'Enroll Confirmation',
                    'Do you want to enroll?',
                    [
                      { text: 'No', style: 'cancel' },
                      { text: 'Yes', onPress: () => handleEnroll(item._id) },
                    ],
                    { cancelable: true }
                  );
                }}
              >
                <Text style={styles.enrollButtonText}>Enroll Now</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

  if (loading && courses.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2575fc" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(15, 35, 61, 1)', '#9eecf7ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.bannerContainer}
      >
        <Text style={styles.bannerText}>✨ Keep exploring, learning never stops!</Text>
      </LinearGradient>

      <FlatList
        data={courses}
        keyExtractor={(item) => item._id}
        renderItem={renderCourseCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2575fc']} />
        }
        ListFooterComponent={loading && <ActivityIndicator color="#2575fc" />}
      />
    </SafeAreaView>
  );
};

export default StudentAllCourses;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { justifyContent: 'center', alignItems: 'center' },

  bannerContainer: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(12),
    margin: scale(16),
  },
  bannerText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '600',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(24),
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
    elevation: 3,
    shadowColor: 'rgba(15, 35, 61, 1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: verticalScale(130),
    backgroundColor: '#eaeaea',
  },
  cardContent: { padding: scale(12) },
  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(6),
    color: '#0f233d',
  },
  subjectCapsule: {
    backgroundColor: 'rgba(15, 35, 61, 1)',
    alignSelf: 'flex-start',
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(20),
    marginBottom: verticalScale(6),
  },
  subjectText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#fff',
  },
  cardDescription: {
    fontSize: moderateScale(13),
    color: '#555',
    marginBottom: verticalScale(6),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  enrollButton: {
    backgroundColor: 'rgba(15, 35, 61, 1)',
    borderWidth: 1,
    borderColor: 'rgba(15, 35, 61, 1)',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(10),
    elevation: 3,
  },
  disabledButton: {
  backgroundColor: '#ccc',
  borderColor: '#ccc',
      paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(10),
    elevation: 3,
},
  enrollButtonText: { color: 'white', fontWeight: '600', fontSize: moderateScale(12) },
  statusText: { fontSize: moderateScale(12), fontWeight: '600' },
  active: { color: 'green' },
  inactive: { color: 'red' },

  inactiveCard: {
  opacity: 0.6,
  backgroundColor: '#f0f0f0',
  shadowColor: '#c9c9c9ff',
  shadowOpacity: 0.2,
},

unavailableContainer: {
  marginTop: verticalScale(8),
  paddingVertical: verticalScale(6),
  alignItems: 'center',
  // borderTopWidth: 1,
  // borderTopColor: '#ccc',
},

unavailableText: {
  color: 'rgba(15, 35, 61, 1)',
  fontSize: moderateScale(13),
  fontWeight: '600',
  fontStyle: 'italic',
},
instructorText: {
  fontSize: moderateScale(12),
  color: 'rgba(15, 35, 61, 1)',
  marginBottom: verticalScale(4),
  // fontStyle: 'italic',
  fontWeight: '600',
},
});