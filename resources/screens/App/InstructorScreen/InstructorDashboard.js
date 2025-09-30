import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

export default function DashboardScreen() {
  // -----------------------------
  // Dummy Stats & Activities
  // -----------------------------
  const [stats, setStats] = useState({
    courses: 3,
    lessons: 12,
    students: 45,
  });

  const [activities, setActivities] = useState([
    { id: "1", text: "New course 'React Basics' created" },
    { id: "2", text: "Lesson 2 added in 'Advanced JavaScript'" },
    { id: "3", text: "Student enrolled in 'Node.js & Express'" },
  ]);

  // -----------------------------
  // Quick Action Modals
  // -----------------------------
  const [addCourseModalVisible, setAddCourseModalVisible] = useState(false);
  const [addLessonModalVisible, setAddLessonModalVisible] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
  });

  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    order: "",
  });

  // -----------------------------
  // Quick Actions
  // -----------------------------
  const actions = [
    { id: "1", label: "Add Course", icon: "add-circle-outline" },
    { id: "2", label: "Add Lesson", icon: "document-text-outline" },
    { id: "3", label: "Manage Students", icon: "people-outline" },
  ];

  const handleAction = (actionId) => {
    switch (actionId) {
      case "1":
        setAddCourseModalVisible(true);
        break;
      case "2":
        setAddLessonModalVisible(true);
        break;
      case "3":
        Alert.alert("Manage Students", "Redirect to Students tab (dummy)");
        break;
      default:
        break;
    }
  };

  // -----------------------------
  // Render Activity Item
  // -----------------------------
  const renderActivity = ({ item }) => (
    <View style={styles.activityItem}>
      <Ionicons name="notifications-outline" size={18} color="#6200EE" />
      <Text style={styles.activityText}>{item.text}</Text>
    </View>
  );

  // -----------------------------
  // Dummy Submit Handlers
  // -----------------------------
  const handleAddCourse = () => {
    if (!courseForm.title || !courseForm.category || !courseForm.description) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    Alert.alert("Success", `Course "${courseForm.title}" added (dummy)`);
    setAddCourseModalVisible(false);
    setCourseForm({ title: "", description: "", category: "", imageUrl: "" });
  };

  const handleAddLesson = () => {
    if (!lessonForm.title || !lessonForm.content || !lessonForm.order) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    Alert.alert("Success", `Lesson "${lessonForm.title}" added (dummy)`);
    setAddLessonModalVisible(false);
    setLessonForm({ title: "", content: "", order: "" });
  };

  return (
    <LinearGradient colors={["#ffffff", "#ffffff"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Instructor Dashboard</Text>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="book-outline" size={28} color="#6200EE" />
            <Text style={styles.statNumber}>{stats.courses}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="document-text-outline" size={28} color="#6200EE" />
            <Text style={styles.statNumber}>{stats.lessons}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={28} color="#6200EE" />
            <Text style={styles.statNumber}>{stats.students}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <FlatList
          data={activities}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => handleAction(action.id)}
            >
              <Ionicons name={action.icon} size={30} color="#ffffff" />
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ---------------- Add Course Modal ---------------- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addCourseModalVisible}
          onRequestClose={() => setAddCourseModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Course</Text>
              <TextInput
                style={styles.input}
                placeholder="Title (required)"
                value={courseForm.title}
                onChangeText={(text) =>
                  setCourseForm({ ...courseForm, title: text })
                }
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Description (required)"
                value={courseForm.description}
                onChangeText={(text) =>
                  setCourseForm({ ...courseForm, description: text })
                }
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Category (required)"
                value={courseForm.category}
                onChangeText={(text) =>
                  setCourseForm({ ...courseForm, category: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Image URL (optional)"
                value={courseForm.imageUrl}
                onChangeText={(text) =>
                  setCourseForm({ ...courseForm, imageUrl: text })
                }
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddCourse}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: "#bbb" }]}
                onPress={() => setAddCourseModalVisible(false)}
              >
                <Text style={styles.submitButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ---------------- Add Lesson Modal ---------------- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addLessonModalVisible}
          onRequestClose={() => setAddLessonModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Lesson</Text>
              <TextInput
                style={styles.input}
                placeholder="Title (required)"
                value={lessonForm.title}
                onChangeText={(text) =>
                  setLessonForm({ ...lessonForm, title: text })
                }
              />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Content (required)"
                value={lessonForm.content}
                onChangeText={(text) =>
                  setLessonForm({ ...lessonForm, content: text })
                }
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Order (required)"
                value={lessonForm.order}
                keyboardType="numeric"
                onChangeText={(text) =>
                  setLessonForm({ ...lessonForm, order: text })
                }
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddLesson}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: "#bbb" }]}
                onPress={() => setAddLessonModalVisible(false)}
              >
                <Text style={styles.submitButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: "700", color: "#000", marginBottom: 20 },

  // Stats
  statsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    width: "30%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: { fontSize: 18, fontWeight: "700", marginTop: 8, color: "#000" },
  statLabel: { fontSize: 13, color: "#555", marginTop: 4 },

  // Activity
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#000", marginBottom: 10, marginTop: 10 },
  activityItem: { flexDirection: "row", alignItems: "center", marginBottom: 8, backgroundColor: "#f8f8f8", padding: 10, borderRadius: 10 },
  activityText: { marginLeft: 8, color: "#333", fontSize: 14 },

  // Actions
  actionsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 10 },
  actionCard: { backgroundColor: "#6200EE", borderRadius: 16, width: "47%", marginBottom: 15, paddingVertical: 20, justifyContent: "center", alignItems: "center" },
  actionText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 20, maxHeight: "90%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 12 },
  submitButton: { backgroundColor: "#6200EE", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  submitButtonText: { color: "#fff", fontWeight: "600" },
});
