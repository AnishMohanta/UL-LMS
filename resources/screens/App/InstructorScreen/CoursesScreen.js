import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

export default function CoursesScreen() {
  // -----------------------------
  // State variables
  // -----------------------------
  const [courses, setCourses] = useState([]);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
  });

  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    category: "",
  });

  const [viewCourse, setViewCourse] = useState(null);

  // -----------------------------
  // Load dummy courses initially
  // -----------------------------
  useEffect(() => {
    const dummyCourses = [
      {
        id: "1",
        title: "React Native Basics",
        instructor: "John Doe",
        students: 120,
        duration: "6 weeks",
        category: "Mobile",
        description: "Learn React Native basics.",
      },
      {
        id: "2",
        title: "Advanced JavaScript",
        instructor: "Jane Smith",
        students: 95,
        duration: "4 weeks",
        category: "Web",
        description: "Deep dive into JavaScript.",
      },
      {
        id: "3",
        title: "Node.js & Express",
        instructor: "Alex Johnson",
        students: 150,
        duration: "8 weeks",
        category: "Backend",
        description: "Build APIs with Node.js and Express.",
      },
    ];
    setCourses(dummyCourses);
  }, []);

  // -----------------------------
  // View Course Details
  // -----------------------------
  const handleViewCourse = async (id) => {
    // ---------------- Example GET API (commented out) ----------------
    /*
    try {
      const response = await fetch(`https://example.com/api/courses/${id}`);
      const data = await response.json();
      setViewCourse(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch course details.");
    }
    */

    // For now, mock using local data
    const course = courses.find((c) => c.id === id);
    setViewCourse(course);
    setViewModalVisible(true);
  };

  // -----------------------------
  // Delete Course
  // -----------------------------
  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this course?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // ---------------- Example DELETE API (commented out) ----------------
            /*
            try {
              const response = await fetch(`https://example.com/api/courses/${id}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer YOUR_TOKEN_HERE" },
              });
              const result = await response.json();
              Alert.alert("Success", result.message);
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete course");
            }
            */

            // For now, remove from local state
            setCourses((prev) => prev.filter((course) => course.id !== id));
          },
        },
      ]
    );
  };

  // -----------------------------
  // Edit Course
  // -----------------------------
  const handleEditSubmit = async () => {
    if (!editForm.title || !editForm.category) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    // ---------------- Example PUT API (commented out) ----------------
    /*
    try {
      const response = await fetch(`https://example.com/api/courses/${editForm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_TOKEN_HERE",
        },
        body: JSON.stringify({ title: editForm.title, category: editForm.category }),
      });
      const updatedCourse = await response.json();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update course");
    }
    */

    // For now, update local state
    setCourses((prev) =>
      prev.map((course) =>
        course.id === editForm.id
          ? { ...course, title: editForm.title, category: editForm.category }
          : course
      )
    );
    setEditModalVisible(false);
  };

  // -----------------------------
  // Render a single course card
  // -----------------------------
  const renderCourse = ({ item }) => (
    <TouchableOpacity onPress={() => handleViewCourse(item.id)}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Ionicons name="book-outline" size={22} color="#6200EE" />
        </View>
        <Text style={styles.courseInstructor}>By {item.instructor}</Text>
        <View style={styles.courseInfoRow}>
          <View style={styles.infoBadge}>
            <Ionicons name="people-outline" size={16} color="#555" />
            <Text style={styles.infoText}>{item.students} Students</Text>
          </View>
          <View style={styles.infoBadge}>
            <Ionicons name="time-outline" size={16} color="#555" />
            <Text style={styles.infoText}>{item.duration}</Text>
          </View>
          <View style={styles.infoBadge}>
            <Ionicons name="pricetag-outline" size={16} color="#555" />
            <Text style={styles.infoText}>{item.category}</Text>
          </View>
        </View>

        {/* Edit & Delete Buttons */}
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#5817d2ff" }]}
            onPress={() => {
              setEditForm({ id: item.id, title: item.title, category: item.category });
              setEditModalVisible(true);
            }}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#ff3b30", marginLeft: 10 }]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#ffffffff", "#ffffffff"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        {courses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color="gray" />
            <Text style={styles.emptyText}>No Courses Available</Text>
          </View>
        ) : (
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id}
            renderItem={renderCourse}
            contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
          />
        )}

        {/* Floating Add Course Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setAddModalVisible(true)}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>

        {/* -----------------------------
            Add Course Modal
        ----------------------------- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addModalVisible}
          onRequestClose={() => setAddModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>Add New Course</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Title (required)"
                  value={form.title}
                  onChangeText={(text) => setForm({ ...form, title: text })}
                />
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="Description (required)"
                  value={form.description}
                  onChangeText={(text) => setForm({ ...form, description: text })}
                  multiline
                />
                <TextInput
                  style={styles.input}
                  placeholder="Category (required)"
                  value={form.category}
                  onChangeText={(text) => setForm({ ...form, category: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Image URL (optional)"
                  value={form.imageUrl}
                  onChangeText={(text) => setForm({ ...form, imageUrl: text })}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => Alert.alert("Add course logic here")}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: "#bbb" }]}
                  onPress={() => setAddModalVisible(false)}
                >
                  <Text style={styles.submitButtonText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* -----------------------------
            Edit Course Modal
        ----------------------------- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>Edit Course</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Title (required)"
                  value={editForm.title}
                  onChangeText={(text) => setEditForm({ ...editForm, title: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Category (required)"
                  value={editForm.category}
                  onChangeText={(text) => setEditForm({ ...editForm, category: text })}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleEditSubmit}
                >
                  <Text style={styles.submitButtonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: "#bbb" }]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.submitButtonText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* -----------------------------
            View Course Modal
        ----------------------------- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={viewModalVisible}
          onRequestClose={() => setViewModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                {viewCourse ? (
                  <>
                    <Text style={styles.modalTitle}>{viewCourse.title}</Text>
                    <Text style={styles.detailLabel}>Instructor:</Text>
                    <Text style={styles.detailText}>{viewCourse.instructor}</Text>
                    <Text style={styles.detailLabel}>Category:</Text>
                    <Text style={styles.detailText}>{viewCourse.category}</Text>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailText}>{viewCourse.description}</Text>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.detailText}>{viewCourse.duration}</Text>
                    <Text style={styles.detailLabel}>Students Enrolled:</Text>
                    <Text style={styles.detailText}>{viewCourse.students}</Text>

                    <TouchableOpacity
                      style={[styles.submitButton, { marginTop: 15 }]}
                      onPress={() => setViewModalVisible(false)}
                    >
                      <Text style={styles.submitButtonText}>Close</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text>Loading...</Text>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  courseTitle: { fontSize: 16, fontWeight: "700", color: "#6200EE" },
  courseInstructor: { marginTop: 4, fontSize: 13, color: "#555" },
  courseInfoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, flexWrap: "wrap" },
  infoBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f4ff", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, marginTop: 4 },
  infoText: { marginLeft: 6, fontSize: 12, color: "#333" },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 10, fontSize: 16, color: "gray" },

  fab: { position: "absolute", bottom: 25, right: 25, backgroundColor: "#6200EE", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 6 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 20, maxHeight: "90%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  detailLabel: { fontWeight: "600", marginTop: 10 },
  detailText: { fontSize: 14, color: "#333", marginBottom: 5 },

  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 12 },
  submitButton: { backgroundColor: "#6200EE", paddingVertical: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  submitButtonText: { color: "#fff", fontWeight: "600" },

  actionButton: { paddingVertical: 6, paddingHorizontal: 15, borderRadius: 8 },
  actionText: { color: "#fff", fontWeight: "600" },
});
