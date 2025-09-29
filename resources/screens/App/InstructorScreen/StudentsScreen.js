import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

export default function StudentsScreen() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Dummy data (replace with API later)
    const dummyStudents = [
      { id: "1", name: "Sasank Sekhar Badatya", email: "sasank@example.com" },
      { id: "2", name: "Anish Majhi", email: "majhi@example.com" },
      { id: "3", name: "Arpita Nayak", email: "arpita@example.com" },
    ];
    setStudents(dummyStudents);
  }, []);

  const renderStudent = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="person-circle-outline" size={24} color="#243cc4ff" />
        <Text style={styles.studentName}>{item.name}</Text>
      </View>
      <Text style={styles.studentEmail}>{item.email}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={["#ffffffff", "#ffffffff"]} // Gradient colors
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {students.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color='#6200EE' />
            <Text style={styles.emptyText}>No Students Found</Text>
          </View>
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => item.id}
            renderItem={renderStudent}
            contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
          />
        )}

        {/* Floating Add Student Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => alert("Add Student")}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
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
  cardHeader: { flexDirection: "row", alignItems: "center" },
  studentName: { fontSize: 16, fontWeight: "700", marginLeft: 10 },
  studentEmail: { fontSize: 13, color: "#555", marginTop: 4 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { marginTop: 10, fontSize: 16, color: "gray" },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: '#6200EE',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
