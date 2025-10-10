import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Image,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { base_url } from '../../../api/ApiEndPoints';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Toast from 'react-native-simple-toast';


export default function CourseDetailsScreen({ route, navigation }) {
  const { course, onGoBack } = route.params || {};
  if (!course) return null;

  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonOrder, setLessonOrder] = useState('');
  const [lessonVideo, setLessonVideo] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [token, setToken] = useState('');

  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [currentLessonTitle, setCurrentLessonTitle] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);


  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (!storedToken) {
        Toast.show('Please login first', Toast.SHORT);
        navigation.replace('Login');
        return;
      }

      setToken(storedToken);
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (!selectedLesson) {
      // New lesson: enable save if any field has value
      setHasChanges(
        lessonTitle !== '' ||
          lessonContent !== '' ||
          lessonOrder !== '' ||
          lessonVideo,
      );
    } else {
      // Existing lesson: enable save only if some field changed
      setHasChanges(
        lessonTitle !== selectedLesson.title ||
          lessonContent !== selectedLesson.content ||
          lessonOrder !== String(selectedLesson.order) ||
          lessonVideo, // new video selected
      );
    }
  }, [lessonTitle, lessonContent, lessonOrder, lessonVideo, selectedLesson]);
  
  const fetchLessons = async (pageNumber = 1, reset = false) => {
  if (!token) return;

  if (pageNumber === 1) setLessonsLoading(true);
  else setLoadingMore(true);

  try {
    const res = await axios.get(
      `${base_url}/lessons/course/${course._id}?page=${pageNumber}&limit=10&sortBy=order&sortOrder=asc`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = res.data?.data?.data || [];
    const pagination = res.data?.data?.pagination;

    if (pageNumber === 1 || reset) {
      setLessons(data);
      setPage(1);
    } else {
      setLessons(prev => [...prev, ...data]);
    }

    setHasMore(Boolean(pagination?.hasNextPage));
  } catch (err) {
    console.error(err.response?.data || err.message);
    Toast.show('Failed to fetch lessons', Toast.SHORT);
  } finally {
    setLessonsLoading(false);
    setLoadingMore(false);
    setRefreshing(false);
  }
};

  
//   const fetchLessons = async (pageNumber = 1) => {
//   if (!token) return;
//   if (pageNumber === 1) setLessonsLoading(true);
//   else setLoadingMore(true);

//   try {
//     const res = await axios.get(
//       `${base_url}/lessons/course/${course._id}?page=${pageNumber}&limit=10&sortBy=order&sortOrder=asc`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     const data = res.data?.data?.data || [];
//     const pagination = res.data?.data?.pagination;

//     if (pageNumber === 1) {
//       setLessons(data);
//     } else {
//       setLessons(prev => [...prev, ...data]);
//     }

//     setHasMore(Boolean(pagination?.hasNextPage));
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     Toast.show('Failed to fetch lessons', Toast.SHORT);
//   } finally {
//     setLessonsLoading(false);
//     setLoadingMore(false);
//     setRefreshing(false);
//   }
// };
  const loadMoreLessons = () => {
  if (loadingMore || !hasMore) return;
  const nextPage = page + 1;
  setPage(nextPage);
  fetchLessons(nextPage);
};

  useEffect(() => {
    if (token) fetchLessons();
  }, [token]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLessons();
  }, [token]);

  const openLessonModal = (lesson = null) => {
    setSelectedLesson(lesson);
    setLessonTitle(lesson ? lesson.title : '');
    setLessonContent(lesson ? lesson.content : '');
    setLessonOrder(lesson ? String(lesson.order) : '');
    setLessonVideo(null);
    setModalVisible(true);
    setHasChanges(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setLessonVideo(null);
    setModalLoading(false);
  };

  const handlePickVideo = async () => {
    const options = { mediaType: 'video', videoQuality: 'high' };
    launchImageLibrary(options, response => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      const video = response.assets?.[0];
      if (video) setLessonVideo(video);
    });
  };

  const handleSaveLesson = async () => {
    if (!lessonTitle || !lessonContent || !lessonOrder) {
      Alert.alert('Validation Error', 'Please fill all fields.');
      return;
    }

    setModalLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', lessonTitle);
      formData.append('content', lessonContent);
      formData.append('order', lessonOrder);

      if (lessonVideo?.uri) {
        formData.append('video', {
          uri: lessonVideo.uri,
          type: lessonVideo.type || 'video/mp4',
          name: lessonVideo.fileName || 'lesson_video.mp4',
        });
      }

      let res;
      if (selectedLesson) {
        res = await axios.put(
          `${base_url}/lessons/${selectedLesson._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      } else {
        res = await axios.post(
          `${base_url}/lessons/course/${course._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      }

      if (res.data.success) {
        Toast.show(
          selectedLesson ? 'Lesson updated' : 'Lesson created',
          Toast.SHORT,
        );
        await new Promise(resolve => setTimeout(resolve, 400));
        await fetchLessons(1,true);
        if (onGoBack) onGoBack();
        closeModal();
      } else {
        throw new Error('Operation failed.');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      Toast.show(
        err.response?.data?.message || 'Failed to save lesson',
        Toast.SHORT,
      );
    } finally {
      setModalLoading(false);
    }
  };
  const handleDeleteLesson = lessonId => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this lesson?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleteLoading(prev => ({ ...prev, [lessonId]: true }));

            try {
              const res = await axios.delete(
                `${base_url}/lessons/${lessonId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              );

              if (res.data.success) {
                Toast.show('Lesson deleted', Toast.SHORT);

                // ✅ Remove the deleted lesson from local state without fetching again
                setLessons(prevLessons =>
                  prevLessons.filter(lesson => lesson._id !== lessonId),
                );
              } else {
                throw new Error('Delete failed');
              }
            } catch (err) {
              console.error(err.response?.data || err.message);
              Toast.show(
                err.response?.data?.message || 'Failed to delete lesson',
                Toast.SHORT,
              );
            } finally {
              setDeleteLoading(prev => ({ ...prev, [lessonId]: false }));
            }
          },
        },
      ],
    );
  };

  const handlePlayVideo = (url, lessonName) => {
    if (!url) {
      Toast.show('No video available', Toast.SHORT);
      return;
    }
    setCurrentVideoUrl(url);
    setCurrentLessonTitle(lessonName);
    setVideoModalVisible(true);
    StatusBar.setHidden(true);
    try {
      Orientation.lockToPortrait();
    } catch (e) {
      console.warn('Orientation lock failed', e);
    }
  };

  const closeVideo = () => {
    setVideoModalVisible(false);
    setCurrentVideoUrl(null);
    StatusBar.setHidden(false);
    try {
      Orientation.unlockAllOrientations();
    } catch (e) {
      console.warn('Orientation unlock failed', e);
    }
  };

  const renderLesson = ({ item }) => (
    <View style={styles.lessonCard}>
      <View style={styles.lessonRow}>
        <TouchableOpacity
          onPress={() => handlePlayVideo(item.videoUrl, item.title)}
        >
          {item.videoUrl ? (
            <Image
              source={{
                uri: item.videoUrl.replace(/\.(mp4|mov|avi|mkv)$/i, '.jpg'),
              }}
              style={styles.lessonThumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.lessonThumbnail, styles.noVideoBox]}>
              <Text style={{ color: '#777' }}>No Video</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.lessonDetails}>
          <Text style={styles.lessonTitle}>{item.title}</Text>
          <Text style={styles.lessonContent}>{item.content}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.updateButton]}
              onPress={() => openLessonModal(item)}
            >
              <Ionicons name="pencil" size={18} color="#fff" />
              <Text style={styles.actionText}> Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDeleteLesson(item._id)}
              disabled={deleteLoading[item._id]} // check only this lesson
            >
              {deleteLoading[item._id] ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.actionText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.courseTitle}>{course.title}</Text>
      <Text style={styles.courseDescription}>{course.description}</Text>

      {lessonsLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#09203F" />
        </View>
      ) : lessons.length === 0 ? (
        <Text style={styles.noLessonsText}>No lessons yet</Text>
      ) : (
        <FlatList
          data={lessons}
  keyExtractor={item => item._id}
  renderItem={renderLesson}
  showsVerticalScrollIndicator={false}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={() => {
        setPage(1);
        setHasMore(true);
        fetchLessons(1);
      }}
      colors={['#09203F']}
            />
          }
          onEndReached={loadMoreLessons}
  onEndReachedThreshold={0.5}
  ListFooterComponent={
    loadingMore && (
      <ActivityIndicator
        size="small"
        color="#09203F"
        style={{ marginVertical: 10 }}
      />)}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => openLessonModal()}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Create/Update Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedLesson ? 'Update Lesson' : 'Create Lesson'}
            </Text>
            <TextInput
              placeholder="Lesson Title"
              value={lessonTitle}
              onChangeText={setLessonTitle}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Content"
              value={lessonContent}
              onChangeText={setLessonContent}
              multiline
              numberOfLines={4}
              style={[styles.modalInput, { textAlignVertical: 'top' }]}
            />
            <TextInput
              placeholder="Order"
              value={lessonOrder}
              onChangeText={setLessonOrder}
              keyboardType="numeric"
              style={styles.modalInput}
            />

            <TouchableOpacity
              style={[styles.modalInput, styles.videoPicker]}
              onPress={handlePickVideo}
            >
              <Text style={{ color: lessonVideo ? '#09203F' : '#777' }}>
                {lessonVideo ? '✅ Video Selected' : '🎥 Pick a Video'}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.updateButton,
                  { opacity: !hasChanges || modalLoading ? 0.5 : 1 }, // ✅ Fade when disabled
                ]}
                onPress={handleSaveLesson}
                disabled={!hasChanges || modalLoading}
              >
                {modalLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionText}>Save</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={closeModal}
              >
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Fullscreen Video */}
      <Modal visible={videoModalVisible} animationType="fade" transparent>
        <View style={styles.videoOverlay}>
          <StatusBar hidden />
          <Video
            source={{ uri: currentVideoUrl }}
            controls
            resizeMode="contain"
            style={{ width: '100%', height: '100%' }}
            fullscreenOrientation="landscape"
          />
          <TouchableOpacity style={styles.backButton} onPress={closeVideo}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.videoTitle}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              {course.title} - {currentLessonTitle}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '"#CFE7F0"', padding: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  courseTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#09203F',
  },
  courseDescription: { fontSize: 15, color: '#555', marginBottom: 16 },
  lessonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 14,
    padding: 12,
    elevation: 3,
  },
  lessonRow: { flexDirection: 'row', alignItems: 'flex-start' },
  lessonThumbnail: {
    width: 100,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  noVideoBox: { justifyContent: 'center', alignItems: 'center' },
  lessonDetails: { flex: 1 },
  lessonTitle: { fontSize: 16, fontWeight: '700', color: '#09203F' },
  lessonContent: { marginTop: 2, color: '#333', fontSize: 13 },
  noLessonsText: { color: '#555', textAlign: 'center', marginVertical: 20 },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 10,
  },
  updateButton: {
    backgroundColor: '#09203F',
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: { backgroundColor: '#C62828' },
  actionText: { color: '#fff', fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#09203F',
  },
  modalInput: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  videoPicker: {
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: '#aaa',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#09203F',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabIcon: { color: '#fff', fontSize: 32 },
  videoOverlay: { flex: 1, backgroundColor: '#000' },
  backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
  videoTitle: {
    position: 'absolute',
    top: 40,
    left: 60,
    right: 20,
    zIndex: 10,
  },
});
