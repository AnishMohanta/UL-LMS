// CoursesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { launchImageLibrary } from "react-native-image-picker";
import { my_courses_instructor, base_url } from "../../../api/ApiEndPoints";
import { SafeAreaView } from "react-native-safe-area-context";

const DUMMY_THUMBNAIL = "https://via.placeholder.com/300x150.png?text=Course";


const CourseCard = ({ item, onPress, onToggleActive, onUpdate, togglingId }) => {
  const imageUri = item.imageUrl || item.thumbnail || DUMMY_THUMBNAIL;
  const isInactive = !item.isActive; // 👈 check if inactive

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.courseCard}
      disabled={isInactive} // disable card press if inactive
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.courseImage} resizeMode="cover" />
      </View>

      <View style={styles.courseContent}>
        <Text style={styles.courseTitle}>{item.title || "Untitled Course"}</Text>

        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{item.category || "General"}</Text>
        </View>

        <Text style={styles.courseDesc} numberOfLines={2}>
          {item.description || "No description available."}
        </Text>

        <View style={styles.actionRow}>
          {/* ✅ Active / Inactive Button */}
          <TouchableOpacity
            style={[
              styles.activeButton,
              {
                backgroundColor: item.isActive ? "#28a745" : "#ccc", // grey if inactive
                opacity: togglingId === item._id ? 0.6 : 1,
              },
            ]}
            onPress={(e) => {
              e.stopPropagation();

              // if inactive, disable toggle (can't click)
              if (isInactive) return;

              // Confirm before deactivating
              if (item.isActive) {
                Alert.alert(
                  "Confirm Deactivation",
                  "Do you want to deactivate this item?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Yes", onPress: () => onToggleActive(item) },
                  ]
                );
              } else {
                onToggleActive(item);
              }
            }}
            disabled={isInactive || togglingId === item._id}
          >
            {togglingId === item._id ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons
                  name={item.isActive ? "checkmark-circle" : "pause-circle"}
                  size={18}
                  color="#fff"
                />
                <Text style={styles.buttonText}>
                  {item.isActive ? "Active" : "Inactive"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* ✅ Update Button */}
          <TouchableOpacity
            style={[
              styles.updateButton,
              isInactive && { opacity: 0.5 }, // dim if inactive
            ]}
            onPress={(e) => {
              e.stopPropagation();
              if (isInactive) return; // disable update if inactive
              onUpdate(item);
            }}
            disabled={isInactive}
          >
            <Ionicons name="pencil" size={18} color="#fff" />
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};


export default function CoursesScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [updating, setUpdating] = useState(false);


  const fetchCourses = async (pageNumber = 1) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return navigation.replace("LoginScreen");
      if (pageNumber === 1) setLoading(true);

      const response = await axios.get(
        `${my_courses_instructor}page=${pageNumber}&limit=10&sortBy=createdAt&sortOrder=desc`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const coursesArray = response.data?.data?.data || [];
      if (pageNumber === 1) setCourses(coursesArray);
      else setCourses((prev) => [...prev, ...coursesArray]);

      const pagination = response.data?.data?.pagination;
      setHasMore(Boolean(pagination?.hasNextPage));
    } catch (error) {
      console.log("Fetch Courses Error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to fetch courses!");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses(1);
    const unsubscribe = navigation.addListener("focus", () => fetchCourses(1));
    return unsubscribe;
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCourses(nextPage);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchCourses(1);
  };

  const handleAddCourse = () => navigation.navigate("CreateCourse");
  const handleOpenCourse = (item) => navigation.navigate("CourseDetails", { course: item });


  const handleToggleActive = async (course) => {
  setTogglingId(course._id);

  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.delete(`${base_url}/courses/${course._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.success) {
      // Remove course from UI
      setCourses((prev) => prev.filter((c) => c._id !== course._id));
      Alert.alert("Success", "Course deleted successfully");
    } else {
      Alert.alert("Error", "Unexpected response from server");
    }
  } catch (error) {
    console.log("Delete Error:", error.response?.data || error.message);
    Alert.alert("Error", "Failed to delete course");
  } finally {
    setTogglingId(null);
  }
};

  const handleUpdateCourse = (course) => {
    setSelectedCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setThumbnail(course.imageUrl || null);
    setModalVisible(true);
  };

  const selectImage = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setThumbnail(result.assets[0].uri);
    }
  };

  const submitUpdate = async () => {
    if (!title.trim()) return Alert.alert("Validation", "Title is required");
    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      let payload;
      let headers = { Authorization: `Bearer ${token}` };

      if (thumbnail && !thumbnail.startsWith("http")) {
        payload = new FormData();
        payload.append("title", title);
        payload.append("description", description);
        payload.append("category", category);

        const fileName = thumbnail.split("/").pop();
        payload.append("image", { uri: thumbnail, type: "image/jpeg", name: fileName });
        headers["Content-Type"] = "multipart/form-data";
      } else {
        payload = { title, description, category, imageUrl: thumbnail || "" };
        headers["Content-Type"] = "application/json";
      }

      const response = await axios.put(`${base_url}/courses/${selectedCourse._id}`, payload, {
        headers,
      });

      const updatedCourse = {
        ...selectedCourse,
        ...response.data,
        thumbnail: response.data.imageUrl || thumbnail,
        imageUrl: response.data.imageUrl || thumbnail,
      };

      setCourses((prev) =>
        prev.map((c) => (c._id === selectedCourse._id ? updatedCourse : c))
      );

      Alert.alert("Success", "Course updated successfully");
      setModalVisible(false);
    } catch (error) {
      console.log("Update Error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update course");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && courses.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#09203F" />
          <Text style={styles.loadingText}>Loading Courses...</Text>
        </View>
      ) : courses.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Ionicons name="book-outline" size={90} color="#09203F" />
          <Text style={styles.noDataText}>No Courses Found</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CourseCard
              item={item}
              onPress={() => handleOpenCourse(item)}
              onToggleActive={handleToggleActive}
              onUpdate={handleUpdateCourse}
              togglingId={togglingId}
            />
          )}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleAddCourse}>
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>

      {/* Modal Section */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Update Course</Text>

              <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />

              <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
                {thumbnail ? (
                  <Image source={{ uri: thumbnail }} style={styles.previewImage} />
                ) : (
                  <Text style={{ color: "#555" }}>Pick an Image</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitButton, updating && { opacity: 0.6 }]}
                onPress={submitUpdate}
                disabled={updating}
              >
                <Text style={styles.submitText}>{updating ? "Updating..." : "Update"}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.submitText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: { padding: 12, paddingBottom: 120 },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  imageContainer: { width: "100%", height: 150, backgroundColor: "#eee" },
  courseImage: { width: "100%", height: "100%" },
  courseContent: { padding: 12 },
  courseTitle: { fontSize: 16, fontWeight: "700", color: "#000" },
  categoryChip: {
    alignSelf: "flex-start",
    backgroundColor: "#09203F",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginVertical: 4,
  },
  categoryText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  courseDesc: { fontSize: 13, color: "#555", marginVertical: 4 },
  actionRow: { flexDirection: "row", gap: 10 },
  activeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#09203F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", marginLeft: 4, fontSize: 12 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 25,
    backgroundColor: "#09203F",
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 10,
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", borderRadius: 14, padding: 16, width: "90%", maxHeight: "90%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  imagePicker: { height: 150, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  previewImage: { width: "100%", height: "100%", borderRadius: 8 },
  submitButton: { backgroundColor: "#09203F", padding: 12, borderRadius: 8, alignItems: "center", marginVertical: 5 },
  submitText: { color: "#fff", fontWeight: "700" },
  cancelButton: { backgroundColor: "#888", padding: 12, borderRadius: 8, alignItems: "center", marginVertical: 5 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#09203F" },
  noDataContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noDataText: { fontSize: 16, color: "#09203F", marginTop: 10 },
});
