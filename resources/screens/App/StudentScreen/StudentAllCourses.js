import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { all_courses_url } from '../../../api/ApiEndPoints';

const { height } = Dimensions.get('window');

const StudentAllCourses = ({ navigation }) => {
const [courseList, setCourseList] = useState([]);
const [allCourses, setAllCourses] = useState([]);
const [modalVisible, setModalVisible] = useState(false);
const [selectedCategory, setSelectedCategory] = useState(null);
const [loading, setLoading] = useState(true);

// Fetch courses from API
useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await axios.get(all_courses_url);
      const courses = response.data.map((course) => ({
        id: course._id,
        title: course.title,
        category: course.category, 
        description: course.description,
        subscription: false,
      }));
      setCourseList(courses);
      setAllCourses(courses); 
    } catch (error) {
      console.log('Error fetching courses:', error);
      Alert.alert('Error', 'Unable to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);

// Get unique categories for filter modal
const categories = [...new Set(allCourses.map((c) => c.category))];

// Subscribe handler
const handleSubscribe = (id) => {
  Alert.alert('Subscribed!', `You have subscribed to course ID: ${id}`);
};

// Filter logic
const applyFilter = (category) => {
  setSelectedCategory(category);
  setCourseList(allCourses.filter((c) => c.category === category));
  setModalVisible(false);
};

const clearFilter = () => {
  setSelectedCategory(null);
  setCourseList(allCourses); 
  setModalVisible(false);
};
  // Render each card
  const renderCourseCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.subjectCapsule}>
        <Text style={styles.subjectText}>{item.category}</Text>
      </View>
      <Text style={styles.cardDescription}>{item.description}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={() => handleSubscribe(item.id)}
        >
          <Text style={styles.subscribeButtonText}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2575fc" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <CustomHeader title="All Courses" onBackPress={() => navigation.goBack()} /> */}

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

      <View style={styles.capsule}>
        <Text style={styles.capsuleText}>
          📚 All Available Courses: 
          <Text style={styles.capsuleNumber}>{courseList.length}</Text>
        </Text>
      </View>

      <FlatList
        data={courseList}
        // keyExtractor={(item) => item.id}
             keyExtractor={(item) => item.id.toString()}
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
      <Text style={styles.modalTitle}>Filter by Category</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.modalOption,
              selectedCategory === cat && styles.modalOptionSelected,
            ]}
            onPress={() => applyFilter(cat)}
          >
            <Text
              style={[
                styles.modalOptionText,
                selectedCategory === cat && styles.modalOptionTextSelected,
              ]}
            >
              {cat}
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