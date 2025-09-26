import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const StudentDashboard = ({ navigation }) => {
  

  // Hardcoded course data
  const courses = [
    {
      id: '1',
      title: 'React Native Basics',
      subject: 'Mobile Development',
      description: 'Learn the basics of React Native and build your first app.',
      progress: 40,
      lessons: 12,
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      subject: 'Programming',
      description: 'Deep dive into modern JavaScript concepts and patterns.',
      progress: 70,
      lessons: 20,
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      subject: 'Design',
      description: 'Understand the principles of good UI and UX design.',
      progress: 25,
      lessons: 10,
    },
  ];

  const renderCourseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      // onPress={() => alert(`Selected Course: ${item.title}`)}
        onPress={() =>
      navigation.navigate('StudentLessons', {
        courseTitle: item.title,
        lessonsCount: item.lessons,
      })
    }
    >
      {/* Title */}
      <Text style={styles.cardTitle}>{item.title}</Text>

      {/* Subject Capsule */}
      <View style={styles.subjectCapsule}>
        <Text style={styles.subjectText}>{item.subject}</Text>
      </View>

      {/* Description */}
      <Text style={styles.cardDescription}>{item.description}</Text>

      {/* Progress */}
      <Text style={styles.cardProgress}>Progress: {item.progress}%</Text>

      {/* Lessons */}
      <Text style={styles.cardLessons}>{item.lessons} Lessons</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Dashboard"
        onBackPress={() => navigation.goBack()}
      />

      {/* Banner */}
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        <Text style={styles.bannerText}>
          👋 Welcome, Anish — 🚀 Keep exploring, learning never stops!
        </Text>
      </LinearGradient>

      {/* Capsule for Subscribed Courses */}
      <View style={styles.capsule}>
        <Text style={styles.capsuleText}>
          📚 Subscribed Courses:{' '}
          <Text style={styles.capsuleNumber}>{courses.length}</Text>
        </Text>
      </View>

      {/* Courses List */}
      <FlatList
        data={courses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  capsule: {
    marginHorizontal: 16,
    marginTop: 12,
      marginBottom: 12, 
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  capsuleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  capsuleNumber: {
    color: '#2575fc',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#40057fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  subjectCapsule: {
    backgroundColor: '#6a11cb',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 8,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  cardProgress: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardLessons: {
    fontSize: 12,
    color: '#777',
  },
});

export default StudentDashboard;