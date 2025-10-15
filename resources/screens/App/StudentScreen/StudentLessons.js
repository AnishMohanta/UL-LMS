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
  Platform,
  ScrollView,
  Linking
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
import Modal from 'react-native-modal';
import Markdown from 'react-native-markdown-display';
import Clipboard from '@react-native-clipboard/clipboard';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';


export default function StudentLessons() {
  const route = useRoute();
  const navigation = useNavigation();
  const { courseId, title, category, description, thumbnail } = route.params || {};
  const { width } = useWindowDimensions();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [playingLessonId, setPlayingLessonId] = useState(null);
  const [updatingLessonId, setUpdatingLessonId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const openLessonModal = (lesson) => {
    setSelectedLesson(lesson);
    setModalVisible(true);
  };

  const API_URL = get_lessonByid_url;
  const COMPLETE_API_URL = complete_lessonByid_url;

  // Check if content contains HTML tags
  const containsHTML = (str) => {
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(str);
  };


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

  const onRefresh = () => {
    setRefreshing(true);
    fetchLessons(1, true);
  };

  const handleEndReached = () => {
    if (hasNextPage && !loading) {
      fetchLessons(page + 1);
    }
  };

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
      <TouchableOpacity onPress={() => openLessonModal(item)}>
        <View style={styles.lessonCard}>
          <View style={styles.lessonHeader}>
            <View style={styles.lessonNumberContainer}>
              <Text style={styles.lessonNumber}>{item.order}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonDescription} numberOfLines={1} ellipsizeMode="tail">
                Click for lesson content
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setPlayingLessonId(isPlaying ? null : item._id)}>
              <Icon
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={moderateScale(32)}
                color="rgba(15, 35, 61, 1)"
              />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={item.isCompleted || updatingLessonId === item._id}
              onPress={() => handleMarkCompleteConfirm(item._id)}
            >
              {updatingLessonId === item._id ? (
                <ActivityIndicator size="small" color="#28a745" />
              ) : (
                <Icon
                  name={item.isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={moderateScale(32)}
                  color={item.isCompleted ? '#28a745' : '#28a745'}
                />
              )}
            </TouchableOpacity>
          </View>

          {isPlaying && item.videoUrl && (
            <View style={styles.videoContainer}>
              <Video
                source={{
                  uri: item.videoUrl,
                  headers: {
                    'User-Agent': 'Mozilla/5.0',
                  }
                }}
                style={styles.videoPlayer}
                controls={true}
                resizeMode="contain"
                paused={false}
                repeat={false}
                playInBackground={false}
                playWhenInactive={false}
                ignoreSilentSwitch="ignore"
                mixWithOthers="mix"
                onLoad={(data) => {
                  console.log('Video loaded successfully:', data);
                }}
                onBuffer={(buffer) => {
                  console.log('Video buffering:', buffer);
                }}
                onError={(e) => {
                  console.error('Video playback error:', e);
                  Alert.alert(
                    'Play on Browser',
                    `Cannot play this video in App. Open in Browser`,
                    [
                      { text: 'OK' },
                      {
                        text: 'Open in Browser',
                        onPress: () => Linking.openURL(item.videoUrl)
                      }
                    ]
                  );
                  setPlayingLessonId(null);
                }}
                onEnd={() => {
                  console.log('Video ended');
                }}
              />
              <View style={styles.videoOverlay}>
                <Text style={styles.videoTitle}>{title} {item.title}</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
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

      <Text
        style={styles.bannerDescription}
        numberOfLines={showFullDescription ? undefined : 4}
      >
        {description}
      </Text>

     
      {description.length > 100 && ( 
        <Text
          style={{ color: 'rgba(15, 35, 61, 1)', marginTop: 4 ,fontWeight:"600"}}
          onPress={() => setShowFullDescription(prev => !prev)}
        >
          {showFullDescription ? 'Show Less' : 'Show More ...'}
        </Text>
      )}
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

      <Modal
        isVisible={modalVisible}
        // onBackdropPress={() => setModalVisible(false)}
        style={{ margin: 0 }}
      >
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
     
        
<View
  style={{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
  }}
>
  <TouchableOpacity
    onPress={() => setModalVisible(false)}
    style={{
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
      padding: 6,
    }}
  >
    <Icon name="close" size={24} color="rgba(15, 35, 61, 1)" />
  </TouchableOpacity>
</View>

          {selectedLesson && (  
            <>
               <View style={{ marginBottom: 16, backgroundColor:"rgba(240, 240, 240, 0.5)" , borderRadius:20, padding:10}}>
      <Text style={{ fontWeight: '700', fontSize: moderateScale(18), marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontWeight: '500', fontSize: moderateScale(18), marginBottom: 8 }}>
        Lesson {selectedLesson.order}: {selectedLesson.title}
      </Text>
    </View>
            <ScrollView showsVerticalScrollIndicator={false}>
        

              {containsHTML(selectedLesson.content) ? (
                // Render HTML content
                <RenderHtml
                  contentWidth={width - 32}
                  source={{ html: selectedLesson.content }}
                  tagsStyles={{
                    body: { color: '#555', fontSize: moderateScale(14) },
                    p: { marginBottom: 12 },
                    h1: { fontSize: moderateScale(22), fontWeight: '700', marginVertical: 10 },
                    h2: { fontSize: moderateScale(20), fontWeight: '700', marginVertical: 8 },
                    h3: { fontSize: moderateScale(18), fontWeight: '600', marginVertical: 8 },
                    h4: { fontSize: moderateScale(16), fontWeight: '600', marginVertical: 6 },
                    code: {
                      backgroundColor: '#1e1e1e',
                      color: '#fff',
                      fontFamily: 'monospace',
                      padding: 10,
                      borderRadius: 8
                    },
                    pre: {
                      backgroundColor: '#1e1e1e',
                      padding: 10,
                      borderRadius: 8,
                      marginVertical: 8
                    },
                    a: { color: '#007AFF', textDecorationLine: 'underline' },
                    ul: { marginLeft: 10 },
                    ol: { marginLeft: 10 },
                    li: { marginBottom: 4 },
                    blockquote: {
                      borderLeftWidth: 4,
                      borderLeftColor: '#ddd',
                      paddingLeft: 12,
                      fontStyle: 'italic',
                      color: '#666'
                    },
                    table: { borderWidth: 1, borderColor: '#ddd', marginVertical: 8 },
                    th: { backgroundColor: '#f5f5f5', padding: 8, fontWeight: '600' },
                    td: { padding: 8, borderWidth: 1, borderColor: '#ddd' }
                  }}
                  renderersProps={{
                    a: {
                      onPress: (event, href) => {
                        Linking.openURL(href);
                      }
                    }
                  }}
                />
              ) : (
                // Render Markdown content
                <Markdown
                  style={{
                    body: { color: '#555', fontSize: moderateScale(14) },
                    heading1: { fontSize: moderateScale(22), fontWeight: '700', marginVertical: 10 },
                    heading2: { fontSize: moderateScale(20), fontWeight: '700', marginVertical: 8 },
                    heading3: { fontSize: moderateScale(18), fontWeight: '600', marginVertical: 8 },
                    heading4: { fontSize: moderateScale(16), fontWeight: '600', marginVertical: 6 },
                    heading5: { fontSize: moderateScale(15), fontWeight: '600', marginVertical: 6 },
                    heading6: { fontSize: moderateScale(14), fontWeight: '600', marginVertical: 6 },
                    paragraph: { marginBottom: 12, lineHeight: 22 },
                    strong: { fontWeight: '700' },
                    em: { fontStyle: 'italic' },
                    link: { color: '#007AFF', textDecorationLine: 'underline' },
                    blockquote: {
                      backgroundColor: '#f9f9f9',
                      borderLeftWidth: 4,
                      borderLeftColor: '#ddd',
                      paddingLeft: 12,
                      paddingVertical: 8,
                      fontStyle: 'italic',
                      color: '#666',
                      marginVertical: 8
                    },
                    bullet_list: { marginVertical: 8 },
                    ordered_list: { marginVertical: 8 },
                    list_item: { marginBottom: 4 },
                    code_inline: {
                      backgroundColor: '#eaeaea',
                      fontFamily: 'monospace',
                      paddingHorizontal: 4,
                      paddingVertical: 2,
                      borderRadius: 4,
                      fontSize: moderateScale(13)
                    },
                    hr: {
                      backgroundColor: '#ddd',
                      height: 1,
                      marginVertical: 16
                    },
                    table: {
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 4,
                      marginVertical: 8
                    },
                    thead: { backgroundColor: '#f5f5f5' },
                    th: { padding: 8, fontWeight: '600', borderWidth: 1, borderColor: '#ddd' },
                    td: { padding: 8, borderWidth: 1, borderColor: '#ddd' }
                  }}
                  rules={{
                    fence: (node, children, parent, styles) => {
                      return (
                        <View
                          key={node.key}
                          style={{
                            backgroundColor: '#1e1e1e',
                            borderRadius: 8,
                            padding: 10,
                            marginVertical: 8,
                            position: 'relative'
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              Clipboard.setString(node.content);
                              Toast.show({
                                type: 'success',
                                text1: 'Code copied',
                              });
                            }}
                            style={{
                              position: 'absolute',
                              top: 6,
                              right: 6,
                              padding: 6,
                              backgroundColor: '#333',
                              borderRadius: 4,
                              zIndex: 1
                            }}
                          >
                            <Text style={{ color: '#fff', fontSize: moderateScale(12) }}>Copy</Text>
                          </TouchableOpacity>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Text
                              style={{
                                color: '#fff',
                                marginTop: 30,
                                fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                                fontSize: moderateScale(13),
                                lineHeight: 20
                              }}
                            >
                              {node.content}
                            </Text>
                          </ScrollView>
                        </View>
                      );
                    },
                    code_inline: (node, children, parent, styles) => {
                      return (
                        <Text
                          key={node.key}
                          style={{
                            backgroundColor: '#eaeaea',
                            fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                            paddingHorizontal: 4,
                            paddingVertical: 2,
                            borderRadius: 4,
                            fontSize: moderateScale(13)
                          }}
                        >
                          {node.content}
                        </Text>
                      );
                    },
                
                    link: (node, children, parent, styles) => {
                      const url = node.attributes?.href;

                      const handlePress = (pressedUrl) => {
                        if (!pressedUrl) {
                          Toast.show({
                            type: 'error',
                            text1: 'No valid URL found',
                            text2: 'Link is missing or malformed',
                          });
                          return;
                        }

                        Linking.canOpenURL(pressedUrl)
                          .then((supported) => {
                            if (supported) {
                              Linking.openURL(pressedUrl);
                            } else {
                              Toast.show({
                                type: 'error',
                                text1: 'Cannot open link',
                                text2: 'Invalid URL',
                              });
                            }
                          })
                          .catch(() => {
                            Toast.show({
                              type: 'error',
                              text1: 'Error',
                              text2: 'Failed to open link',
                            });
                          });
                      };

                      return (
                        <TouchableOpacity
                          key={node.key + Math.random()} // unique key to isolate
                          onPress={() => handlePress(url)}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: '#007AFF', textDecorationLine: 'underline' }}>
                            {children}
                          </Text>
                        </TouchableOpacity>
                      );
                    },
                    image: (node, children, parent, styles) => {
                      return (
                        <Image
                          key={node.key}
                          source={{ uri: node.attributes.src }}
                          style={{
                            width: width - 64,
                            height: 200,
                            resizeMode: 'contain',
                            marginVertical: 8,
                            borderRadius: 8
                          }}
                        />
                      );
                    }
                  }}
                  onLinkPress={(url) => {
                    Linking.openURL(url);
                    return false;
                  }}
                >
                  {selectedLesson.content}
                </Markdown>
              )}
            </ScrollView>
            </>      
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc' },
  bannerContainer: { marginBottom: verticalScale(16) },
  bannerImage: {
    width: '100%',
    height: verticalScale(180),
    backgroundColor: '#eaeaea'
  },
  bannerTextContainer: {
    padding: moderateScale(14),
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
    marginTop: verticalScale(-20),
    elevation: 3,
  },
  bannerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#0f233d',
    marginBottom: verticalScale(6)
  },
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
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
    elevation: 3
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  lessonNumberContainer: {
    backgroundColor: 'rgba(15, 35, 61, 1)',
    width: scale(36),
    height: scale(36),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  lessonNumber: {
    color: '#fff',
     fontWeight: '700',
    fontSize: moderateScale(16)
  },
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