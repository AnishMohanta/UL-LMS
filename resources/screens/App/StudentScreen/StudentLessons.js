import React from 'react';
import { View, Text, FlatList, StyleSheet} from 'react-native';
import CustomHeader from '../../../components/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StudentLessons({ route, navigation }) {
  const { courseTitle, lessonsCount } = route.params;

  // Generate hardcoded lessons based on lessonsCount
  const lessons = Array.from({ length: lessonsCount }, (_, i) => ({
    id: i + 1,
    title: `Lesson ${i + 1}`,
    description: `Description for Lesson ${i + 1}`,
    completed: i % 2 === 0, // for demo: alternate completed true/false
  }));

  const renderLesson = ({ item }) => (
    <View style={styles.lessonCard}>
      <Text style={styles.lessonTitle}>
        {item.completed ? '✅ ' : '⬜ '} {item.title}
      </Text>
      <Text style={styles.lessonDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={courseTitle}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={lessons}
        renderItem={renderLesson}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  listContent: { padding: 16 },
  lessonCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#555',
  },
});