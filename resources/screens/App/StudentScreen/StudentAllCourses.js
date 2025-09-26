import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

const StudentAllCourses = ({ navigation }) => {
  const courses = [
    { id: '1', title: 'React Native Basics', subject: 'Mobile Development', description: 'Learn the basics of React Native and build your first app.', lessons: 12, subscription: true },
    { id: '2', title: 'Advanced JavaScript', subject: 'Programming', description: 'Deep dive into modern JavaScript concepts and patterns.', lessons: 20, subscription: true },
    { id: '3', title: 'UI/UX Design Fundamentals', subject: 'Design', description: 'Understand the principles of good UI and UX design.', lessons: 10, subscription: true },
    { id: '4', title: 'Python for Beginners', subject: 'Programming', description: 'Learn Python from scratch and build small projects.', lessons: 15, subscription: false },
    { id: '5', title: 'Mastering C++ Basics', subject: 'Programming', description: 'Understand core C++ concepts and solve coding problems.', lessons: 25, subscription: false },
    { id: '6', title: 'Responsive Web Design with HTML & CSS', subject: 'Web Development', description: 'Design mobile-friendly web pages using modern HTML5 and CSS3.', lessons: 18, subscription: false },
    { id: '7', title: 'Express.js for Beginners', subject: 'Backend Development', description: 'Learn to build scalable REST APIs using Express.js framework.', lessons: 14, subscription: false },
    { id: '8', title: 'Applied Machine Learning', subject: 'Artificial Intelligence', description: 'Work on ML projects like spam detection and image recognition.', lessons: 22, subscription: false },
    { id: '9', title: 'Advanced SQL Queries', subject: 'Databases', description: 'Learn advanced SQL joins, triggers, and stored procedures.', lessons: 16, subscription: false },
    { id: '10', title: 'Ethical Hacking Basics', subject: 'Security', description: 'Learn penetration testing and protect systems against threats.', lessons: 12, subscription: false },

  ];

  const [courseList, setCourseList] = useState(courses);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Get unique subjects
  const subjects = [...new Set(courses.map((c) => c.subject))];

  // Subscribe handler
  const handleSubscribe = (id) => {
    // setCourseList((prev) =>
    //   prev.map((course) =>
    //     course.id === id ? { ...course, subscription: true } : course
    //   )
    // );
    Alert.alert('Subscribed!', `You have subscribed to course ID: ${id}`);
  };

  // Filter logic
  const applyFilter = (subject) => {
    setSelectedSubject(subject);
    setCourseList(courses.filter((c) => c.subject === subject));
    setModalVisible(false);
  };

  const clearFilter = () => {
    setSelectedSubject(null);
    setCourseList(courses);
    setModalVisible(false);
  };

  // Render each card
  const renderCourseCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.subjectCapsule}>
        <Text style={styles.subjectText}>{item.subject}</Text>
      </View>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardLessons}>{item.lessons} Lessons</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            item.subscription && styles.subscribedButton,
          ]}
          onPress={() => !item.subscription && handleSubscribe(item.id)}
          disabled={item.subscription}
        >
          <Text
            style={[
              styles.subscribeButtonText,
              item.subscription && styles.subscribedButtonText,
            ]}
          >
            {item.subscription ? 'Subscribed' : 'Subscribe'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="All Courses" onBackPress={() => navigation.goBack()} />

      {/* Welcome Banner */}
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
          start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.bannerContainer}
      >
        <Text style={styles.bannerText}>✨ Keep exploring, learning never stops!</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Capsule for All Courses number*/}
      <View style={styles.capsule}>
        <Text style={styles.capsuleText}>
          📚 {selectedSubject ? selectedSubject : 'All Available Courses'}:{' '}
          <Text style={styles.capsuleNumber}>{courseList.length}</Text>
        </Text>
      </View>

      {/* Courses List */}
      <FlatList
        data={courseList}
        keyExtractor={(item) => item.id}
        renderItem={renderCourseCard}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
    <Modal
  visible={modalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Filter by Subject</Text>

      {/* Scrollable options */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {subjects.map((subj, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.modalOption,
              selectedSubject === subj && styles.modalOptionSelected,
            ]}
            onPress={() => applyFilter(subj)}
          >
            <Text
              style={[
                styles.modalOptionText,
                selectedSubject === subj && styles.modalOptionTextSelected,
              ]}
            >
              {subj}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.clearButton} onPress={clearFilter}>
        <Text style={styles.clearButtonText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
};

export default StudentAllCourses;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    margin: 15,
  },
  bannerText: { color: '#fff', fontSize: 16, flex: 1, marginRight: 10 },
  filterButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  capsule: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 4,
  },
  capsuleText: { fontSize: 16, fontWeight: '600', color: '#333' },
  capsuleNumber: { fontWeight: '700', color: '#6a11cb' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  subjectCapsule: {
    backgroundColor: '#6a11cb',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 8,
  },
  subjectText: { fontSize: 12, fontWeight: '600', color: 'white' },
  cardDescription: { fontSize: 14, color: '#555', marginBottom: 8 },
  cardLessons: { fontSize: 12, color: '#777', marginBottom: 12 },

  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
  subscribeButton: {
    backgroundColor: '#2575fc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  subscribedButton: { backgroundColor: '#ddd' },
  subscribeButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  subscribedButtonText: { color: '#555' },

  // Modal Styles
 modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'flex-end',
},
modalContent: {
  backgroundColor: '#fff',
  padding: 20,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  maxHeight: '70%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  elevation: 10,
},
modalTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 15,
  textAlign: 'center',
  color: '#333',
},
modalOption: {
  paddingVertical: 14,
  paddingHorizontal: 15,
  borderRadius: 12,
  marginVertical: 5,
  backgroundColor: '#f5f5f5',
},
modalOptionSelected: {
  backgroundColor: '#2575fc',
},
modalOptionText: {
  fontSize: 16,
  color: '#333',
},
modalOptionTextSelected: {
  color: '#fff',
  fontWeight: '700',
},
clearButton: {
  marginTop: 20,
  padding: 14,
  alignItems: 'center',
  backgroundColor: '#2575fc',
  borderRadius: 12,
},
clearButtonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
},
});