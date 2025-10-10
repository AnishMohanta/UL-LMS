import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { my_courses_instructor, base_url } from "../../../api/ApiEndPoints";

// // Enable LayoutAnimation on Android
// if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

export default function StudentsScreen() {
  const [students, setStudents] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchCourses = async (token) => {
    let allCourses = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      try {
        const res = await axios.get(
          `${my_courses_instructor}&page=${page}&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const courses = res.data.data?.data || [];
        const pagination = res.data.data?.pagination || {};

        allCourses = [...allCourses, ...courses];
        hasNextPage = pagination.hasNextPage || false;
        page++;
      } catch (err) {
        console.warn("Error fetching courses:", err);
        hasNextPage = false;
      }
    }

    return allCourses;
  };

  const fetchStudentsForCourse = async (courseId, token) => {
    let allStudents = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      try {
        const res = await axios.get(
          `${base_url}/courses/${courseId}/students?page=${page}&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data.data?.data || [];
        const pagination = res.data.data?.pagination || {};
        allStudents = [...allStudents, ...data];
        hasNextPage = pagination.hasNextPage || false;
        page++;
      } catch (err) {
        console.warn(`Error fetching students for course ${courseId}:`, err);
        hasNextPage = false;
      }
    }

    return allStudents;
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.error("No user token found! Please login first.");
        setLoading(false);
        return;
      }

      const courses = await fetchCourses(token);
      setCoursesCount(courses.length);

      const studentMap = {};
      const coursePromises = courses.map(async (course) => {
        const enrolledStudents = await fetchStudentsForCourse(course._id, token);
        enrolledStudents.forEach((s) => {
          if (!studentMap[s._id]) {
            studentMap[s._id] = {
              id: s._id,
              name: s.name,
              email: s.email,
              courses: [],
              expanded: false,
            };
          }
          studentMap[s._id].courses.push(course.title || "N/A");
        });
      });

      await Promise.all(coursePromises);

      const studentsArray = Object.values(studentMap);
      setStudents(studentsArray);
      setStudentsCount(studentsArray.length);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, expanded: !student.expanded } : student
      )
    );
  };

  const renderStudent = ({ item }) => (
    <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.85}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={28} color="#09203F" />
          <Text style={styles.studentName}>{item.name}</Text>
        </View>
        <Text style={styles.studentEmail}>{item.email}</Text>
        {item.expanded && (
          <View style={styles.coursesContainer}>
            {item.courses.map((course, index) => (
              <View key={index} style={styles.courseCapsule}>
                <Text style={styles.courseText}>{course}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ padding: 15, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Top Summary Cards */}
        <View style={styles.topCardsContainer}>
          <LinearGradient
            colors={["#CFE7F0", "#09203F"]}
            style={styles.summaryCard}
          >
            <Ionicons name="people-outline" size={28} color="white" />
            <Text style={[styles.summaryNumber, { color: "white" }]}>
              {studentsCount}
            </Text>
            <Text style={[styles.summaryLabel, { color: "white" }]}>
              Students
            </Text>
          </LinearGradient>
          <LinearGradient
            colors={["#CFE7F0", "#09203F"]}
            style={styles.summaryCard}
          >
            <Ionicons name="book-outline" size={28} color="white" />
            <Text style={[styles.summaryNumber, { color: "white" }]}>
              {coursesCount}
            </Text>
            <Text style={[styles.summaryLabel, { color: "white" }]}>
              Courses
            </Text>
          </LinearGradient>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#09203F"
            style={{ marginTop: 50 }}
          />
        ) : students.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#09203F" />
            <Text style={styles.emptyText}>No Students Found</Text>
          </View>
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => item.id}
            renderItem={renderStudent}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    marginHorizontal: 5,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  summaryLabel: { fontSize: 14 },

  card: {
    backgroundColor: "#f7f7f7ff",
    borderRadius: 16,
    borderColor: "#CFE7F0",
    padding: 15,
    marginBottom: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
    color: "#09203F",
  },
  studentEmail: { fontSize: 13, color: "#555", marginTop: 4 },

  coursesContainer: { marginTop: 10, flexDirection: "row", flexWrap: "wrap" },
  courseCapsule: {
    backgroundColor: "#09203F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  courseText: { color: "white", fontSize: 13 },

  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: { marginTop: 10, fontSize: 16, color: "gray" },
});
