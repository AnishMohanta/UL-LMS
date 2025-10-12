/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../../components/CustomHeader';
import axios from 'axios';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  scale,
  verticalScale,
  moderateScale,
} from 'react-native-size-matters';
import { complete_lessonByid_url, get_lessonByid_url } from '../../../api/ApiEndPoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function StudentLessons() {
  const route = useRoute();
  const navigation = useNavigation();
  const { courseId, title, category, description, thumbnail } = route.params || {};

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [playingLessonId, setPlayingLessonId] = useState(null);
  const [updatingLessonId, setUpdatingLessonId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const API_URL = get_lessonByid_url;
  // const COMPLETE_API_URL = 'https://lms-backend-main.onrender.com/api/enrollments/mark-complete';
  const COMPLETE_API_URL = complete_lessonByid_url;

  // Fetch lessons (paginated)
  const fetchLessons = useCallback(
    async (pageNumber = 1, isRefresh = false) => {
      if (loading) return;
      try {
        if (!isRefresh) setLoading(true);
        const token = await AsyncStorage.getItem('userToken');

        const response = await axios.get(
          `${API_URL}/${courseId}?page=${pageNumber}&limit=10&sortBy=order&sortOrder=asc`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data?.success) {
          const fetchedLessons = response.data?.data?.data || [];
          const pagination = response.data?.data?.pagination || {};

          setLessons((prev) => {
            if (isRefresh) return fetchedLessons;
            const updated = [...prev];
            fetchedLessons.forEach((lesson) => {
              const existingIndex = updated.findIndex((l) => l._id === lesson._id);
              if (existingIndex !== -1) {
                updated[existingIndex] = { ...updated[existingIndex], ...lesson };
              } else {
                updated.push(lesson);
              }
            });
            return updated;
            
          });

          setHasNextPage(pagination.hasNextPage);
          setPage(pageNumber);
              Toast.show({
          type: 'success',
          text1: 'Lessons loaded successfully',
          text2: `Your Lessons list is up-to-date`,
          
        });
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
          Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load lessons.',
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading, API_URL, courseId]
  );

  useEffect(() => {
    if (courseId) fetchLessons(1, true);
  }, [courseId]);

  // Refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchLessons(1, true);
  };

  // Pagination
  const handleEndReached = () => {
    if (hasNextPage && !loading) {
      fetchLessons(page + 1);
    }
  };

  // Mark lesson complete
  // const handleMarkComplete = async (lessonId) => {
  //   try {
  //     setUpdatingLessonId(lessonId);
  //     const token = await AsyncStorage.getItem('userToken');
  //     const response = await axios.post(
  //       COMPLETE_API_URL,
  //       { lessonId },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.data?.success) {
  //       setLessons((prevLessons) =>
  //         prevLessons.map((lesson) =>
  //           lesson._id === lessonId ? { ...lesson, isCompleted: true } : lesson
  //         )
  //       );
  //       Alert.alert('Success', 'Lesson marked as completed.');
  //     } else {
  //       Alert.alert('Error', 'Could not mark lesson as completed.');
  //     }
  //   } catch (error) {
  //     console.error('Error marking lesson complete:', error);
  //     Alert.alert('Error', 'Something went wrong while marking complete.');
  //   } finally {
  //     setUpdatingLessonId(null);
  //   }
  // };

  const handleMarkCompleteConfirm = (lessonId) => {
    Alert.alert(
      'Confirm Completion',
      'Do you want to mark this lesson as complete?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => handleMarkComplete(lessonId) },
      ],
      { cancelable: true }
    );
  };

  // Mark lesson complete
  const handleMarkComplete = async (lessonId) => {
    try {
      setUpdatingLessonId(lessonId);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        COMPLETE_API_URL,
        { lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        setLessons((prevLessons) =>
          prevLessons.map((lesson) =>
            lesson._id === lessonId ? { ...lesson, isCompleted: true } : lesson
          )
        );
        Toast.show({
        type: 'success',
        text1: 'Lesson completed!',
        text2: 'Nice job finishing this lesson 🎉',
      });
      } else {
           Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not mark lesson as completed.',
        });
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong while marking complete.',
      });
    } finally {
      setUpdatingLessonId(null);
    }
  };



  const renderLessonCard = ({ item }) => {
    const isPlaying = playingLessonId === item._id;

    return (
      <View style={styles.lessonCard}>
        <View style={styles.lessonHeader}>
          <View style={styles.lessonNumberContainer}>
            <Text style={styles.lessonNumber}>{item.order}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.lessonTitle}>{item.title}</Text>
            <Text style={styles.lessonDescription}>{item.content}</Text>
          </View>

          {/* Play / Pause */}
          <TouchableOpacity
            onPress={() => setPlayingLessonId(isPlaying ? null : item._id)}>
            <Icon
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={moderateScale(32)}
              color="rgba(15, 35, 61, 1)"
            />
          </TouchableOpacity>

          {/* Completion */}
          <TouchableOpacity
            disabled={item.isCompleted || updatingLessonId === item._id}
            // onPress={() => handleMarkComplete(item._id)}
            onPress={() => handleMarkCompleteConfirm(item._id)}
          >
            {updatingLessonId === item._id ? (
              <ActivityIndicator size="small" color="#28a745" />
            ) : (
              // <Icon
              //   name="checkmark-circle"
              //   size={moderateScale(32)}
              //   color={item.isCompleted ? '#28a745' : '#ccc'}
              // />
                        <Icon
  name={item.isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
  size={moderateScale(32)}
  color={item.isCompleted ? '#28a745' : '#28a745'}
/>
            )}
          </TouchableOpacity>

        </View>

        {/* Video Player */}
        {isPlaying && item.videoUrl && (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: encodeURI(item.videoUrl) }}
              style={styles.videoPlayer}
              controls
              resizeMode="contain"
              paused={false}
              onError={(e) => {
                console.error('Video playback error:', e);
                Alert.alert('Playback Error', 'Cannot play this video.');
              }}
            />
            <View style={styles.videoOverlay}>
              <Text style={styles.videoTitle}>{title} {item.title}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Lessons" onBackPress={() => navigation.goBack()} />

      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        renderItem={renderLessonCard}
        contentContainerStyle={{ paddingBottom: verticalScale(50) }}
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
        ListHeaderComponent={
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: thumbnail }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>{title}</Text>
              <Text style={styles.bannerCategory}>{category}</Text>
              <Text style={styles.bannerDescription}>{description}</Text>
            </View>
          </View>
        }
         ListEmptyComponent={
    !loading && (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No lesson available now!!</Text>
      </View>
    )
  }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc' },
  bannerContainer: { marginBottom: verticalScale(16) },
  bannerImage: { width: '100%', height: verticalScale(180), backgroundColor: '#eaeaea' },
  bannerTextContainer: {
    padding: moderateScale(14),
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
    marginTop: verticalScale(-20),
    elevation: 3,
  },
  bannerTitle: { fontSize: moderateScale(20), fontWeight: '700', color: '#0f233d', marginBottom: verticalScale(6) },
  bannerCategory: {
    backgroundColor: 'rgba(15, 35, 61, 1)',
    alignSelf: 'flex-start',
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(20),
    color: '#fff',
    fontWeight: '600',
    fontSize: moderateScale(13),
    marginBottom: verticalScale(8),
  },
  bannerDescription: { fontSize: moderateScale(14), color: '#555' },
  lessonCard: { backgroundColor: '#fff', borderRadius: moderateScale(12), padding: moderateScale(16), marginBottom: verticalScale(16), elevation: 3 },
  lessonHeader: { flexDirection: 'row', alignItems: 'center' },
  lessonNumberContainer: {
    backgroundColor: 'rgba(15, 35, 61, 1)',
    width: scale(36),
    height: scale(36),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  lessonNumber: { color: '#fff', fontWeight: '700', fontSize: moderateScale(16) },
  lessonTitle: { fontSize: moderateScale(16), fontWeight: '600', color: 'rgba(15, 35, 61, 1)' },
  lessonDescription: { fontSize: moderateScale(13), color: '#555', marginTop: verticalScale(4) },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: verticalScale(220),
    marginTop: verticalScale(12),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoPlayer: { width: '100%', height: '100%' },
  videoOverlay: {
    position: 'absolute',
    top: verticalScale(10),
    left: scale(10),
    right: scale(10),
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(8),
  },
  videoTitle: { color: '#fff', fontWeight: '600', fontSize: moderateScale(14) },
  emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: moderateScale(20),
},
emptyText: {
  fontSize: moderateScale(16),
  color: '#555',
  fontWeight: '600',
  textAlign: 'center',
},
});