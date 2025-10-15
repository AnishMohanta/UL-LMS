// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Alert,
//   StyleSheet,
//   Modal,
//   TextInput,
//   ActivityIndicator,
//   Image,
//   RefreshControl,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { base_url } from '../../../api/ApiEndPoints';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Video from 'react-native-video';
// import Orientation from 'react-native-orientation-locker';
// import Toast from 'react-native-simple-toast';


// export default function CourseDetailsScreen({ route, navigation }) {
//   const { course, onGoBack } = route.params || {};
//   if (!course) return null;

//   const [lessons, setLessons] = useState([]);
//   const [lessonsLoading, setLessonsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedLesson, setSelectedLesson] = useState(null);
//   const [lessonTitle, setLessonTitle] = useState('');
//   const [lessonContent, setLessonContent] = useState('');
//   const [lessonOrder, setLessonOrder] = useState('');
//   const [lessonVideo, setLessonVideo] = useState(null);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [token, setToken] = useState('');

//   const [videoModalVisible, setVideoModalVisible] = useState(false);
//   const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
//   const [currentLessonTitle, setCurrentLessonTitle] = useState('');
//   const [hasChanges, setHasChanges] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);


//   useEffect(() => {
//     const loadToken = async () => {
//       const storedToken = await AsyncStorage.getItem('userToken');
//       if (!storedToken) {
//         Toast.show('Please login first', Toast.SHORT);
//         navigation.replace('Login');
//         return;
//       }

//       setToken(storedToken);
//     };
//     loadToken();
//   }, []);

//   useEffect(() => {
//     if (!selectedLesson) {
//       // New lesson: enable save if any field has value
//       setHasChanges(
//         lessonTitle !== '' ||
//           lessonContent !== '' ||
//           lessonOrder !== '' ||
//           lessonVideo,
//       );
//     } else {
//       // Existing lesson: enable save only if some field changed
//       setHasChanges(
//         lessonTitle !== selectedLesson.title ||
//           lessonContent !== selectedLesson.content ||
//           lessonOrder !== String(selectedLesson.order) ||
//           lessonVideo, // new video selected
//       );
//     }
//   }, [lessonTitle, lessonContent, lessonOrder, lessonVideo, selectedLesson]);
  
//   const fetchLessons = async (pageNumber = 1, reset = false) => {
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

//     if (pageNumber === 1 || reset) {
//       setLessons(data);
//       setPage(1);
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

  
// //   const fetchLessons = async (pageNumber = 1) => {
// //   if (!token) return;
// //   if (pageNumber === 1) setLessonsLoading(true);
// //   else setLoadingMore(true);

// //   try {
// //     const res = await axios.get(
// //       `${base_url}/lessons/course/${course._id}?page=${pageNumber}&limit=10&sortBy=order&sortOrder=asc`,
// //       { headers: { Authorization: `Bearer ${token}` } }
// //     );

// //     const data = res.data?.data?.data || [];
// //     const pagination = res.data?.data?.pagination;

// //     if (pageNumber === 1) {
// //       setLessons(data);
// //     } else {
// //       setLessons(prev => [...prev, ...data]);
// //     }

// //     setHasMore(Boolean(pagination?.hasNextPage));
// //   } catch (err) {
// //     console.error(err.response?.data || err.message);
// //     Toast.show('Failed to fetch lessons', Toast.SHORT);
// //   } finally {
// //     setLessonsLoading(false);
// //     setLoadingMore(false);
// //     setRefreshing(false);
// //   }
// // };
//   const loadMoreLessons = () => {
//   if (loadingMore || !hasMore) return;
//   const nextPage = page + 1;
//   setPage(nextPage);
//   fetchLessons(nextPage);
// };

//   useEffect(() => {
//     if (token) fetchLessons();
//   }, [token]);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchLessons();
//   }, [token]);

//   const openLessonModal = (lesson = null) => {
//     setSelectedLesson(lesson);
//     setLessonTitle(lesson ? lesson.title : '');
//     setLessonContent(lesson ? lesson.content : '');
//     setLessonOrder(lesson ? String(lesson.order) : '');
//     setLessonVideo(null);
//     setModalVisible(true);
//     setHasChanges(false);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setLessonVideo(null);
//     setModalLoading(false);
//   };

//   const handlePickVideo = async () => {
//     const options = { mediaType: 'video', videoQuality: 'high' };
//     launchImageLibrary(options, response => {
//       if (response.didCancel) return;
//       if (response.errorMessage) {
//         Alert.alert('Error', response.errorMessage);
//         return;
//       }
//       const video = response.assets?.[0];
//       if (video) setLessonVideo(video);
//     });
//   };

//   const handleSaveLesson = async () => {
//     if (!lessonTitle || !lessonContent || !lessonOrder) {
//       Alert.alert('Validation Error', 'Please fill all fields.');
//       return;
//     }

//     setModalLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('title', lessonTitle);
//       formData.append('content', lessonContent);
//       formData.append('order', lessonOrder);

//       if (lessonVideo?.uri) {
//         formData.append('video', {
//           uri: lessonVideo.uri,
//           type: lessonVideo.type || 'video/mp4',
//           name: lessonVideo.fileName || 'lesson_video.mp4',
//         });
//       }

//       let res;
//       if (selectedLesson) {
//         res = await axios.put(
//           `${base_url}/lessons/${selectedLesson._id}`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           },
//         );
//       } else {
//         res = await axios.post(
//           `${base_url}/lessons/course/${course._id}`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           },
//         );
//       }

//       if (res.data.success) {
//         Toast.show(
//           selectedLesson ? 'Lesson updated' : 'Lesson created',
//           Toast.SHORT,
//         );
//         await new Promise(resolve => setTimeout(resolve, 400));
//         await fetchLessons(1,true);
//         if (onGoBack) onGoBack();
//         closeModal();
//       } else {
//         throw new Error('Operation failed.');
//       }
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       Toast.show(
//         err.response?.data?.message || 'Failed to save lesson',
//         Toast.SHORT,
//       );
//     } finally {
//       setModalLoading(false);
//     }
//   };
//   const handleDeleteLesson = lessonId => {
//     Alert.alert(
//       'Confirm Delete',
//       'Are you sure you want to delete this lesson?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             setDeleteLoading(prev => ({ ...prev, [lessonId]: true }));

//             try {
//               const res = await axios.delete(
//                 `${base_url}/lessons/${lessonId}`,
//                 {
//                   headers: { Authorization: `Bearer ${token}` },
//                 },
//               );

//               if (res.data.success) {
//                 Toast.show('Lesson deleted', Toast.SHORT);

//                 // ✅ Remove the deleted lesson from local state without fetching again
//                 setLessons(prevLessons =>
//                   prevLessons.filter(lesson => lesson._id !== lessonId),
//                 );
//               } else {
//                 throw new Error('Delete failed');
//               }
//             } catch (err) {
//               console.error(err.response?.data || err.message);
//               Toast.show(
//                 err.response?.data?.message || 'Failed to delete lesson',
//                 Toast.SHORT,
//               );
//             } finally {
//               setDeleteLoading(prev => ({ ...prev, [lessonId]: false }));
//             }
//           },
//         },
//       ],
//     );
//   };

//   const handlePlayVideo = (url, lessonName) => {
//     if (!url) {
//       Toast.show('No video available', Toast.SHORT);
//       return;
//     }
//     setCurrentVideoUrl(url);
//     setCurrentLessonTitle(lessonName);
//     setVideoModalVisible(true);
//     StatusBar.setHidden(true);
//     try {
//       Orientation.lockToPortrait();
//     } catch (e) {
//       console.warn('Orientation lock failed', e);
//     }
//   };

//   const closeVideo = () => {
//     setVideoModalVisible(false);
//     setCurrentVideoUrl(null);
//     StatusBar.setHidden(false);
//     try {
//       Orientation.unlockAllOrientations();
//     } catch (e) {
//       console.warn('Orientation unlock failed', e);
//     }
//   };

//   const renderLesson = ({ item }) => (
//     <View style={styles.lessonCard}>
//       <View style={styles.lessonRow}>
//         <TouchableOpacity
//           onPress={() => handlePlayVideo(item.videoUrl, item.title)}
//         >
//           {item.videoUrl ? (
//             <Image
//               source={{
//                 uri: item.videoUrl.replace(/\.(mp4|mov|avi|mkv)$/i, '.jpg'),
//               }}
//               style={styles.lessonThumbnail}
//               resizeMode="cover"
//             />
//           ) : (
//             <View style={[styles.lessonThumbnail, styles.noVideoBox]}>
//               <Text style={{ color: '#777' }}>No Video</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//         <View style={styles.lessonDetails}>
//           <Text style={styles.lessonTitle}>{item.title}</Text>
//           <Text style={styles.lessonContent}>{item.content}</Text>
//           <View style={styles.actionButtons}>
//             <TouchableOpacity
//               style={[styles.actionButton, styles.updateButton]}
//               onPress={() => openLessonModal(item)}
//             >
//               <Ionicons name="pencil" size={18} color="#fff" />
//               <Text style={styles.actionText}> Update</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.actionButton, styles.deleteButton]}
//               onPress={() => handleDeleteLesson(item._id)}
//               disabled={deleteLoading[item._id]} // check only this lesson
//             >
//               {deleteLoading[item._id] ? (
//                 <ActivityIndicator color="#fff" size="small" />
//               ) : (
//                 <Text style={styles.actionText}>Delete</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.courseTitle}>{course.title}</Text>
//       <Text style={styles.courseDescription}>{course.description}</Text>

//       {lessonsLoading ? (
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" color="#09203F" />
//         </View>
//       ) : lessons.length === 0 ? (
//         <Text style={styles.noLessonsText}>No lessons yet</Text>
//       ) : (
//         <FlatList
//           data={lessons}
//   keyExtractor={item => item._id}
//   renderItem={renderLesson}
//   showsVerticalScrollIndicator={false}
//   refreshControl={
//     <RefreshControl
//       refreshing={refreshing}
//       onRefresh={() => {
//         setPage(1);
//         setHasMore(true);
//         fetchLessons(1);
//       }}
//       colors={['#09203F']}
//             />
//           }
//           onEndReached={loadMoreLessons}
//   onEndReachedThreshold={0.5}
//   ListFooterComponent={
//     loadingMore && (
//       <ActivityIndicator
//         size="small"
//         color="#09203F"
//         style={{ marginVertical: 10 }}
//       />)}
//           contentContainerStyle={{ paddingBottom: 80 }}
//         />
//       )}

//       <TouchableOpacity style={styles.fab} onPress={() => openLessonModal()}>
//         <Text style={styles.fabIcon}>+</Text>
//       </TouchableOpacity>

//       {/* Create/Update Modal */}
//       <Modal visible={modalVisible} animationType="slide" transparent>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>
//               {selectedLesson ? 'Update Lesson' : 'Create Lesson'}
//             </Text>
//             <TextInput
//               placeholder="Lesson Title"
//               value={lessonTitle}
//               onChangeText={setLessonTitle}
//               style={styles.modalInput}
//             />
//             <TextInput
//               placeholder="Content"
//               value={lessonContent}
//               onChangeText={setLessonContent}
//               multiline
//               numberOfLines={4}
//               style={[styles.modalInput, { textAlignVertical: 'top' }]}
//             />
//             <TextInput
//               placeholder="Order"
//               value={lessonOrder}
//               onChangeText={setLessonOrder}
//               keyboardType="numeric"
//               style={styles.modalInput}
//             />

//             <TouchableOpacity
//               style={[styles.modalInput, styles.videoPicker]}
//               onPress={handlePickVideo}
//             >
//               <Text style={{ color: lessonVideo ? '#09203F' : '#777' }}>
//                 {lessonVideo ? '✅ Video Selected' : '🎥 Pick a Video'}
//               </Text>
//             </TouchableOpacity>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={[
//                   styles.actionButton,
//                   styles.updateButton,
//                   { opacity: !hasChanges || modalLoading ? 0.5 : 1 }, // ✅ Fade when disabled
//                 ]}
//                 onPress={handleSaveLesson}
//                 disabled={!hasChanges || modalLoading}
//               >
//                 {modalLoading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text style={styles.actionText}>Save</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.actionButton, styles.deleteButton]}
//                 onPress={closeModal}
//               >
//                 <Text style={styles.actionText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Fullscreen Video */}
//       <Modal visible={videoModalVisible} animationType="fade" transparent>
//         <View style={styles.videoOverlay}>
//           <StatusBar hidden />
//           <Video
//             source={{ uri: currentVideoUrl }}
//             controls
//             resizeMode="contain"
//             style={{ width: '100%', height: '100%' }}
//             fullscreenOrientation="landscape"
//           />
//           <TouchableOpacity style={styles.backButton} onPress={closeVideo}>
//             <Ionicons name="arrow-back" size={28} color="#fff" />
//           </TouchableOpacity>
//           <View style={styles.videoTitle}>
//             <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
//               {course.title} - {currentLessonTitle}
//             </Text>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '"#CFE7F0"', padding: 16 },
//   loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   courseTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginBottom: 4,
//     color: '#09203F',
//   },
//   courseDescription: { fontSize: 15, color: '#555', marginBottom: 16 },
//   lessonCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 15,
//     marginBottom: 14,
//     padding: 12,
//     elevation: 3,
//   },
//   lessonRow: { flexDirection: 'row', alignItems: 'flex-start' },
//   lessonThumbnail: {
//     width: 100,
//     height: 80,
//     borderRadius: 8,
//     backgroundColor: '#ddd',
//     marginRight: 12,
//   },
//   noVideoBox: { justifyContent: 'center', alignItems: 'center' },
//   lessonDetails: { flex: 1 },
//   lessonTitle: { fontSize: 16, fontWeight: '700', color: '#09203F' },
//   lessonContent: { marginTop: 2, color: '#333', fontSize: 13 },
//   noLessonsText: { color: '#555', textAlign: 'center', marginVertical: 20 },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 8,
//   },
//   actionButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     marginLeft: 10,
//   },
//   updateButton: {
//     backgroundColor: '#09203F',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   deleteButton: { backgroundColor: '#C62828' },
//   actionText: { color: '#fff', fontWeight: '600' },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     padding: 16,
//   },
//   modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 16,
//     color: '#09203F',
//   },
//   modalInput: {
//     backgroundColor: '#f4f4f4',
//     borderRadius: 8,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginBottom: 12,
//   },
//   modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
//   videoPicker: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderStyle: 'dashed',
//     borderColor: '#aaa',
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 25,
//     right: 25,
//     backgroundColor: '#09203F',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 8,
//   },
//   fabIcon: { color: '#fff', fontSize: 32 },
//   videoOverlay: { flex: 1, backgroundColor: '#000' },
//   backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
//   videoTitle: {
//     position: 'absolute',
//     top: 40,
//     left: 60,
//     right: 20,
//     zIndex: 10,
//   },
// });






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
  ScrollView,
  Platform,
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
import Markdown from 'react-native-markdown-display';
import YoutubePlayer from 'react-native-youtube-iframe'; // 🆕 YouTube support

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
  const [lessonVideo, setLessonVideo] = useState(null); // file (from picker)
  const [lessonVideoUrl, setLessonVideoUrl] = useState(''); // text url
  const [isVideoModeUrl, setIsVideoModeUrl] = useState(false); // toggle: false -> upload, true -> url
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [token, setToken] = useState('');

  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [currentLessonTitle, setCurrentLessonTitle] = useState('');
  const [videoKey, setVideoKey] = useState(0); // force reload
  const [hasChanges, setHasChanges] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

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
      setHasChanges(
        lessonTitle !== '' ||
          lessonContent !== '' ||
          lessonOrder !== '' ||
          lessonVideo ||
          lessonVideoUrl !== '',
      );
    } else {
      setHasChanges(
        lessonTitle !== selectedLesson.title ||
          lessonContent !== selectedLesson.content ||
          lessonOrder !== String(selectedLesson.order) ||
          lessonVideo ||
          lessonVideoUrl !== (selectedLesson.videoUrl || ''),
      );
    }
  }, [lessonTitle, lessonContent, lessonOrder, lessonVideo, lessonVideoUrl, selectedLesson]);

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
    setLessonVideoUrl(lesson ? (lesson.videoUrl || '') : '');
    setIsVideoModeUrl(false); // default: upload
    setModalVisible(true);
    setHasChanges(false);
    setShowPreview(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setLessonVideo(null);
    setLessonVideoUrl('');
    setIsVideoModeUrl(false);
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
      if (video) {
        setLessonVideo(video);
        setIsVideoModeUrl(false);
        setLessonVideoUrl('');
      }
    });
  };

  const handleSaveLesson = async () => {
    // --- Validation: allow keeping existing video when updating ---
    // If creating (no selectedLesson) video is required (unless URL mode with url provided)
    // If updating and user did not pick a new file AND not providing a new URL, then we allow keeping existing videoUrl.

    // Validate for upload mode
    if (!isVideoModeUrl && !lessonVideo) {
      const hasExistingVideo = selectedLesson && (selectedLesson.videoUrl || selectedLesson.video);
      if (!hasExistingVideo) {
        Alert.alert('Validation Error', 'Please select a video file.');
        setModalLoading(false);
        return;
      }
      // else: updating and existing server video exists -> OK to proceed without picking a new file
    }

    // Validate for URL mode
    if (isVideoModeUrl && (!lessonVideoUrl || lessonVideoUrl.trim() === '')) {
      const hasExistingVideo = selectedLesson && (selectedLesson.videoUrl || selectedLesson.video);
      if (!hasExistingVideo) {
        Alert.alert('Validation Error', 'Please provide a video URL.');
        setModalLoading(false);
        return;
      }
      // else OK (keeping existing)
    }

    // If URL mode and there is a URL provided, validate it's a youtube or common video file
    if (isVideoModeUrl && lessonVideoUrl && lessonVideoUrl.trim() !== '') {
      const lc = lessonVideoUrl.trim().toLowerCase();
      const isVideoFile = /\.(mp4|mov|m3u8|webm|avi|mkv)$/i.test(lc);
      const isYoutube = lc.includes('youtube.com') || lc.includes('youtu.be');

      if (!isVideoFile && !isYoutube) {
        Alert.alert(
          'Validation Error',
          'Please provide a valid video link (YouTube or direct video file).'
        );
        setModalLoading(false);
        return;
      }
    }

    setModalLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', lessonTitle);
      formData.append('content', lessonContent);
      formData.append('order', lessonOrder);

      if (lessonVideo && lessonVideo.uri) {
        formData.append('video', {
          uri: Platform.OS === 'android' ? lessonVideo.uri : lessonVideo.uri.replace('file://', ''),
          type: lessonVideo.type || 'video/mp4',
          name: lessonVideo.fileName || 'lesson_video.mp4',
        });
      } else if (isVideoModeUrl && lessonVideoUrl.trim()) {
        formData.append('videoUrl', lessonVideoUrl.trim());
      }
      // If neither new file nor new URL provided, and selectedLesson exists, we do NOT append anything,
      // server should keep existing video.

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
        Toast.show(selectedLesson ? 'Lesson updated' : 'Lesson created', Toast.SHORT);
        await new Promise(resolve => setTimeout(resolve, 400));
        await fetchLessons(1, true);
        if (onGoBack) onGoBack();
        closeModal();
      } else {
        throw new Error('Operation failed.');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      Toast.show(err.response?.data?.message || 'Failed to save lesson', Toast.SHORT);
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
                setLessons(prevLessons => prevLessons.filter(lesson => lesson._id !== lessonId));
              } else {
                throw new Error('Delete failed');
              }
            } catch (err) {
              console.error(err.response?.data || err.message);
              Toast.show(err.response?.data?.message || 'Failed to delete lesson', Toast.SHORT);
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
    setVideoKey(k => k + 1);
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

  const toggleCard = id => {
    setExpandedCard(prev => (prev === id ? null : id));
  };


  const renderLesson = ({ item }) => {
  const isExpanded = expandedCard === item._id;
  const thumbnailUri = item.videoUrl
    ? item.videoUrl.replace(/\.(mp4|mov|avi|mkv)(\?.*)?$/i, '.jpg')
    : null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => toggleCard(item._id)}
      style={[styles.lessonCardContainer, isExpanded && styles.lessonCardContainerExpanded]}
    >
      <View style={styles.lessonCardShadow}>
        <View style={styles.thumbnailContainer}>
          {item.videoUrl ? (
            <Image source={{ uri: thumbnailUri }} style={styles.thumbnailImage} resizeMode="cover" />
          ) : (
            <View style={styles.noVideoContainer}>
              <Ionicons name="videocam-off-outline" size={26} color="#aaa" />
              <Text style={{ color: '#aaa', fontSize: 12 }}>No Video</Text>
            </View>
          )}

          <View style={styles.overlayGradient}>
            <TouchableOpacity
              onPress={() => handlePlayVideo(item.videoUrl, item.title)}
              style={styles.playButton}
            >
              <Ionicons name="play-circle" size={42} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle}>{item.title}</Text>

          
          <View style={[isExpanded ? styles.markdownExpanded : styles.markdownCollapsed]}>
  <Markdown
    style={{
      body: { color: '#333', fontSize: 13.5, lineHeight: 19 },
      code_block: {
        backgroundColor: '#1e1e1e',
        color: '#fff',
        padding: 8,
        borderRadius: 6,
        fontFamily: 'monospace',
      },
    }}
  >
    {item.content || ''}
  </Markdown>

  {!isExpanded && <View style={styles.fadeBottom} />}
</View>

        </View>

        {isExpanded && (
          <View style={styles.expandedActions}>
            <TouchableOpacity
              style={[styles.expandedButton, { backgroundColor: '#09203F' }]}
              onPress={() => openLessonModal(item)}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.expandedButtonText}> Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.expandedButton, { backgroundColor: '#D32F2F' }]}
              onPress={() => handleDeleteLesson(item._id)}
              disabled={deleteLoading[item._id]}
            >
              {deleteLoading[item._id] ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="trash-outline" size={18} color="#fff" />
              )}
              <Text style={styles.expandedButtonText}> Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

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
              <ActivityIndicator size="small" color="#09203F" style={{ marginVertical: 2}} />
            )
          }
          contentContainerStyle={{ paddingBottom: 160 }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => openLessonModal()}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Create/Update Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                {selectedLesson ? 'Update Lesson' : 'Create Lesson'}
              </Text>

              <TextInput
                placeholder="Lesson Title"
                value={lessonTitle}
                onChangeText={setLessonTitle}
                style={styles.modalInput}
              />

              <View
                style={[
                  styles.modalInput,
                  { backgroundColor: '#fff', padding: 0, borderWidth: 0 },
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ color: '#09203F', fontWeight: '600' }}>
                    Lesson Content
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowPreview(!showPreview)}
                  >
                    <Text style={{ color: '#09203F', fontWeight: '600' }}>
                      {showPreview ? '✏️ Edit' : '👁️ Preview'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {!showPreview ? (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: 8,
                        borderBottomWidth: 1,
                        borderColor: '#ddd',
                        paddingBottom: 4,
                      }}
                    >
                      {[
                        { label: 'B', syntax: '**', type: 'wrap' },
                        { label: 'I', syntax: '_', type: 'wrap' },
                        { label: 'H1', syntax: '# ', type: 'prefix' },
                        { label: 'H2', syntax: '## ', type: 'prefix' },
                        { label: 'H3', syntax: '### ', type: 'prefix' },
                        { label: 'List', syntax: '- ', type: 'prefix' },
                        { label: '1.List', syntax: '1. ', type: 'prefix' },
                        { label: 'Link', syntax: '[text](url)', type: 'insert' },
                        { label: 'Code', syntax: '```js\n\n```', type: 'insert' },
                        { label: 'Quote', syntax: '> ', type: 'prefix' },
                      ].map((btn, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={{
                            backgroundColor: '#E9EFF6',
                            borderRadius: 6,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            marginRight: 6,
                            marginBottom: 6,
                          }}
                          onPress={() => {
                            if (btn.type === 'wrap') {
                              setLessonContent(prev => `${btn.syntax}${prev}${btn.syntax}`);
                            } else if (btn.type === 'prefix') {
                              setLessonContent(prev => `${btn.syntax}${prev}`);
                            } else if (btn.type === 'insert') {
                              setLessonContent(prev => `${prev}${btn.syntax}`);
                            }
                          }}
                        >
                          <Text
                            style={{
                              color: '#09203F',
                              fontWeight: '600',
                              fontSize: 12,
                            }}
                          >
                            {btn.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TextInput
                      placeholder="# Heading\n**Bold**\n- List item\n```js\nconsole.log('Hello');\n```"
                      value={lessonContent}
                      onChangeText={setLessonContent}
                      multiline
                      numberOfLines={10}
                      style={{
                        backgroundColor: '#f4f4f4',
                        borderRadius: 8,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: '#ddd',
                        textAlignVertical: 'top',
                        minHeight: 180,
                        fontFamily: 'monospace',
                      }}
                    />
                  </>
                ) : (
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 8,
                      padding: 12,
                      backgroundColor: '#f9f9f9',
                      minHeight: 180,
                    }}
                  >
                    <Markdown
                      style={{
                        body: { color: '#333', fontSize: 13 },
                        code_block: {
                          backgroundColor: '#1e1e1e',
                          color: '#fff',
                          padding: 8,
                          borderRadius: 6,
                          fontFamily: 'monospace',
                        },
                      }}
                    >
                      {lessonContent}
                    </Markdown>
                  </View>
                )}
              </View>

              <TextInput
                placeholder="Lesson Order"
                keyboardType="number-pad"
                value={lessonOrder}
                onChangeText={setLessonOrder}
                style={styles.modalInput}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                {/* Option to toggle between upload and URL mode - you had this state already.
                    If you want a visible toggle, you can re-enable UI here. */}
              </View>

              {/* Select Video / Change Video button - shows different look when a file is selected */}
              {!isVideoModeUrl ? (
                <TouchableOpacity
                  style={[
                    {
                      padding: 12,
                      borderRadius: 6,
                      alignItems: 'center',
                      marginBottom: 16,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    },
                    lessonVideo
                      ? { backgroundColor: '#dcebffff' } // green when selected
                      : { backgroundColor: '#09203F' }, // default
                  ]}
                  onPress={handlePickVideo}
                >
                  {lessonVideo ? (
                    <>
                      <Ionicons name="checkmark-circle" size={18} color="#579771ff" />
                      <Text style={{ color: '#000000ff', marginLeft: 8, fontWeight: '600' }}>
                        Video selected
                      </Text>
                    </>
                  ) : (
                    <Text style={{ color: '#fff', fontWeight: '600' }}>
                      Select Video
                    </Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TextInput
                  placeholder="https://youtube.com/..."
                  value={lessonVideoUrl}
                  onChangeText={setLessonVideoUrl}
                  style={styles.modalInput}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}

              {/*  if updating and there's already an existing video on server */}
              {selectedLesson && !lessonVideo && !lessonVideoUrl && selectedLesson.videoUrl && (
                <Text style={{ color: '#666', marginBottom: 12 }}>
                  Existing video will be kept unless you select a new file or provide a URL.
                </Text>
              )}

              <TouchableOpacity
                style={{
                  backgroundColor: hasChanges ? '#09203F' : '#ccc',
                  padding: 14,
                  borderRadius: 6,
                  alignItems: 'center',
                  marginBottom: 16,
                }}
                onPress={handleSaveLesson}
                disabled={!hasChanges || modalLoading}
              >
                {modalLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '600' }}>
                    {selectedLesson ? 'Update Lesson' : 'Create Lesson'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{ alignItems: 'center', marginBottom: 12 }}
                onPress={closeModal}
              >
                <Text style={{ color: '#09203F', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Video Modal */}
      <Modal visible={videoModalVisible} animationType="slide" transparent>
        <View style={styles.videoModalOverlay}>
          <View style={styles.videoModalContent}>
            <Text style={{ color: '#fff', fontSize: 18, marginBottom: 12 }}>
              {currentLessonTitle}
            </Text>

            {currentVideoUrl ? (
              currentVideoUrl.includes('youtube.com') || currentVideoUrl.includes('youtu.be') ? (
                <YoutubePlayer
                  height={250}
                  play={true}
                  videoId={
                    currentVideoUrl.includes('youtu.be')
                      ? currentVideoUrl.split('/').pop()
                      : new URL(currentVideoUrl).searchParams.get('v')
                  }
                />
              ) : (
                <Video
                  key={videoKey}
                  source={{ uri: currentVideoUrl }}
                  style={{ width: '100%', height: 250, backgroundColor: '#000' }}
                  controls
                  resizeMode="contain"
                />
              )
            ) : (
              <Text style={{ color: '#fff' }}>No video available</Text>
            )}

            <TouchableOpacity
              style={{
                marginTop: 16,
                backgroundColor: '#09203F',
                paddingVertical: 12,
                borderRadius: 6,
                alignItems: 'center',
              }}
              onPress={closeVideo}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  courseTitle: { fontSize: 22, fontWeight: '700', padding: 16, color: '#09203F' },
  courseDescription: { fontSize: 14, paddingHorizontal: 16, paddingBottom: 12, color: '#444' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noLessonsText: { textAlign: 'center', marginTop: 2, color: '#777' },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 40,
    backgroundColor: '#09203F',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: { fontSize: 32, color: '#fff', lineHeight: 36 },
  lessonCard: { marginHorizontal: 12, marginVertical: 6, borderRadius: 8, backgroundColor: '#fff', padding: 8 },
  lessonCardExpanded: { minHeight: 120 },
  lessonCardCollapsed: { minHeight: 80 },
  lessonRow: { flexDirection: 'row' },
  lessonThumbnail: { width: 100, height: 80, borderRadius: 6, backgroundColor: '#ddd' },
  noVideoBox: { alignItems: 'center', justifyContent: 'center' },
  lessonDetails: { flex: 1, marginLeft: 10 },
  lessonTitle: { fontWeight: '600', color: '#09203F', marginTop: 2 },
  markdownExpanded: { maxHeight: 200 },
  markdownCollapsed: { maxHeight: 60, overflow: 'hidden' },
  actionButtons: { flexDirection: 'row', marginTop: 6 },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 6, marginRight: 8 },
  updateButton: { backgroundColor: '#09203F' },
  deleteButton: { backgroundColor: '#D32F2F' },
  actionText: { color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, padding: 16, maxHeight: '90%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#09203F' },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 12, marginBottom: 12, backgroundColor: '#f9f9f9' },
  videoModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  videoModalContent: { width: '90%', backgroundColor: '#111', borderRadius: 8, padding: 16 },
  lessonCardContainer: {
  marginHorizontal: 14,
  marginVertical: 8,
  borderRadius: 14,
  overflow: 'hidden',
  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 3,
},
lessonCardContainerExpanded: {
  elevation: 5,
  shadowOpacity: 0.25,
},
lessonCardShadow: {
  backgroundColor: '#fff',
  borderRadius: 14,
  overflow: 'hidden',
},
thumbnailContainer: {
  height: 180,
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  overflow: 'hidden',
  backgroundColor: '#eee',
},
thumbnailImage: {
  width: '100%',
  height: '100%',
},
overlayGradient: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},
playButton: {
  backgroundColor: 'rgba(0,0,0,0.4)',
  borderRadius: 50,
  padding: 6,
},
noVideoContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
lessonInfo: {
  padding: 12,
},
lessonTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#09203F',
  marginBottom: 6,
},
markdownCollapsed: {
  maxHeight: 70,
  overflow: 'hidden',
  backgroundColor: '#f8f9fb',
  borderRadius: 8,
  padding: 8,
  marginTop: 4,
  position: 'relative',
},
markdownExpanded: {
  maxHeight: 400,
  backgroundColor: '#fff',
  padding: 8,
  borderRadius: 8,
  marginTop: 4,
},
fadeBottom: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 35,
  backgroundColor: 'rgba(245,245,245,0.9)',
},

expandedActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 12,
  paddingBottom: 12,
  gap: 10,
},
expandedButton: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  paddingVertical: 10,
},
expandedButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 13.5,
},

});
