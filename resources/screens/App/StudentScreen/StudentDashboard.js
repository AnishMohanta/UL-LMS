import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import blankThumbnail from '../../../../assets/images/blank.jpg';
import { enrolled_courses_url } from '../../../api/ApiEndPoints';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';

const StudentDashboard = ({ navigation }) => {
  const [userName, setUserName] = useState('User');
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const  isFocused = useIsFocused()

  const API_URL = enrolled_courses_url;


  // Fetch user name
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        if (name) setUserName(name);
      } catch (error) {
        console.error('Error fetching user name:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to load user data',
          text2: 'Please restart the app or log in again.',
        });
      }
    };
    fetchUserData();
  }, []);

  // Fetch paginated courses
  const fetchCourses = useCallback(
    async (pageNumber = 1, isRefresh = false , showToast = true) => {
      if (loading) return;
      try {
        if (!isRefresh) setLoading(true);
        const token = await AsyncStorage.getItem('userToken');

        const response = await axios.get(
          `${API_URL}?page=${pageNumber}&limit=10&sortBy=createdAt&sortOrder=desc`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedCourses = response?.data?.data?.data || [];
        const pagination = response?.data?.data?.pagination || {};

        const mappedCourses = fetchedCourses.map((item) => ({
          id: item._id,
           courseId: item.course._id, 
          title: item.course?.title || 'Untitled Course',
          category: item.course?.category || 'Uncategorized',
          description: item.course?.description || 'No description available',
          progress: item.progress ?? 0,
          isActive: item.course?.isActive,
          thumbnail: item.course?.imageUrl
            ? { uri: item.course.imageUrl }
            : blankThumbnail,
        }));

        
        // setCourses((prev) => {
        //   const newList = isRefresh ? mappedCourses : [...prev, ...mappedCourses];
        //   const uniqueCourses = newList.filter(
        //     (course, index, self) =>
        //       index === self.findIndex((c) => c.id === course.id)
        //   );
        //   return uniqueCourses;
        // });
// setCourses((prev) => {
//   const mergedCourses = mappedCourses.map((newCourse) => {
//     const existing = prev.find((c) => c.id === newCourse.id);
//     return existing ? { ...existing, ...newCourse } : newCourse;
//   });
//   return mergedCourses;
// });

setCourses((prev) => {
  // When refreshing — replace everything with the latest data
  if (isRefresh) return mappedCourses;

  // Otherwise, for pagination — append or update
  const updatedList = [...prev];

  mappedCourses.forEach((newCourse) => {
    const index = updatedList.findIndex((c) => c.id === newCourse.id);
    if (index !== -1) {
      // ✅ Update existing course details
      updatedList[index] = { ...updatedList[index], ...newCourse };
    } else {
      // ✅ Append new course (from next page)
      updatedList.push(newCourse);
    }
  });

  return updatedList;
});
        setHasNextPage(pagination.hasNextPage);
        setPage(pageNumber);
        if (isRefresh && showToast) {
          Toast.show({
            type: 'success',
            text1: 'Courses refreshed',
            text2: 'Your course list is up-to-date',
          });
        }
      } catch (error) {
        console.error('Error fetching courses:', error.message);
        Toast.show({
          type: 'error',
          text1: 'Failed to load courses',
          text2: error.response?.data?.message || error.message,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading, API_URL]
  );

  // Initial load
  // useEffect(() => {
  //   fetchCourses(1);
  // }, [isFocused]);
  useEffect(() => {
  const loadNewCourses = async () => {
    await fetchCourses(1, true, false); 
  };
  loadNewCourses();
}, [isFocused]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses(1, true);
  };

  // Handle pagination
  const handleEndReached = () => {
    if (hasNextPage && !loading) {
      fetchCourses(page + 1);
    }
  };

  // const renderCourseCard = ({ item }) => (

  //   <TouchableOpacity
  //     style={styles.card}
  //     activeOpacity={0.8}
  //     onPress={() => {
  //       if (item.isActive) {
  //         navigation.navigate('StudentLessons', {
  //           courseId: item.courseId,
  //           title: item.title,
  //           category: item.category,
  //           description: item.description,
  //           thumbnail: item.thumbnail.uri,
  //         });
  //       }
  //     }}
  //     disabled={!item.isActive}
      
  //   >
  //     <Image source={item.thumbnail} style={styles.thumbnail} resizeMode="cover" />
  //     <View style={styles.cardContent}>
  //       <Text style={styles.cardTitle}>{item.title}</Text>
  //       <View style={styles.subjectCapsule}>
  //         <Text style={styles.subjectText}>{item.category}</Text>
  //       </View>
  //       <Text style={styles.cardDescription}>{item.description}</Text>
  //       <Text style={styles.cardProgress}>Progress: {item.progress}%</Text>
  //       <View style={styles.statusContainer}>
  //         <Text
  //           style={[
  //             styles.statusText,
  //             item.isActive ? styles.active : styles.inactive,
  //           ]}
  //         >
  //           {item.isActive ? 'Active' : 'Discontinued'}
  //         </Text>
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );


  const renderCourseCard = ({ item }) => {
  const isInactive = !item.isActive;

  return (
    <TouchableOpacity
      style={[styles.card, isInactive && styles.inactiveCard]}
      activeOpacity={0.8}
      onPress={() => {
        if (!isInactive) {
          navigation.navigate('StudentLessons', {
            courseId: item.courseId,
            title: item.title,
            category: item.category,
            description: item.description,
            thumbnail: item.thumbnail.uri,
          });
        }
      }}
      disabled={isInactive}
    >
      <Image source={item.thumbnail} style={styles.thumbnail} resizeMode="cover" />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>

        <View style={styles.subjectCapsule}>
          <Text style={styles.subjectText}>{item.category}</Text>
        </View>

        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardProgress}>Progress: {item.progress}%</Text>

        {/* Conditional Footer */}
        {isInactive ? (
          <Text style={styles.unavailableNote}>No longer available</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

  if (loading && courses.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="rgba(15, 35, 61, 1)" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(15, 35, 61, 1)', '#9eecf7ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        <Text style={styles.bannerText}>
          👋 Welcome, {userName} — 🚀 Keep exploring, learning never stops!
        </Text>
      </LinearGradient>

      <FlatList
        data={courses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['rgba(15, 35, 61, 1)']}
          />
        }
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="small" color="rgba(15, 35, 61, 1)" />
          ) : null
        }
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>
              No courses found. Subscribe to start learning!
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
};

export default StudentDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc' },
  center: { justifyContent: 'center', alignItems: 'center' },

  banner: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(12),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(12),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
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
    // borderTopLeftRadius: moderateScale(12),
    // borderTopRightRadius: moderateScale(12),
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
    color: 'white',
  },
  cardDescription: {
    fontSize: moderateScale(13),
    color: '#555',
    marginBottom: verticalScale(6),
  },
  cardProgress: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(4),
  },
  statusContainer: {
    alignItems: 'flex-end',
    marginTop: verticalScale(6),
  },
  statusText: { fontSize: moderateScale(12), fontWeight: '600' },
  // active: { color: 'green' },
  // inactive: { color: 'red' },
  inactiveCard: {
  opacity: 0.5, // makes it look faded
},

unavailableNote: {
  textAlign: 'center',
  fontStyle: 'italic',
  color: 'rgba(15, 35, 61, 1)', // subtle red tone
  marginTop: verticalScale(10),
 fontSize: moderateScale(13),
  fontWeight: '600',
},
  emptyText: {
    textAlign: 'center',
    color: '#555',
    marginTop: verticalScale(40),
    fontSize: moderateScale(15),
  },
});