import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

const defaultProfilePic = require("./profile.webp");

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // FETCH PROFILE DATA FROM BACKEND
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://your-api-url.com/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_TOKEN_HERE", // token dynamically lagana hoga
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          Alert.alert("Error", "Failed to fetch profile data");
        }
      } catch (err) {
        Alert.alert("Error", "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // BACK BUTTON HANDLING FOR MODAL
  useEffect(() => {
    const backAction = () => {
      if (modalVisible) {
        setModalVisible(false);
        return true; // handled
      }
      return false; // default behavior
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [modalVisible]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // TODO: clear token + navigate to login
          navigation.replace("LoginScreen");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#243cc4ff" />
        <Text style={styles.emptyText}>Loading Profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="person-circle-outline" size={60} color="gray" />
        <Text style={styles.emptyText}>No Profile Found</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#7755f4ff", "#7755f4ff"]} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
        <View style={styles.profileHeader}>
          <TouchableOpacity
            style={styles.profilePicContainer}
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={defaultProfilePic} // backend image nahi mil rahi, default laga diya
              style={styles.profilePic}
            />
          </TouchableOpacity>

          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.role}>{profile.role}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color="#555" />
            <Text style={styles.infoText}>{profile.email}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color="#555" />
            <Text style={styles.infoText}>
              Joined: {new Date(profile.createdAt).toDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="refresh-outline" size={18} color="#555" />
            <Text style={styles.infoText}>
              Updated: {new Date(profile.updatedAt).toDateString()}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={() => setModalVisible(false)}
            />
            <Image source={defaultProfilePic} style={styles.zoomedImage} />
          </View>
        </Modal>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileHeader: { alignItems: "center", marginBottom: 20 },
  profilePicContainer: { position: "relative" },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: { fontSize: 22, fontWeight: "700", marginTop: 10, color: "#fff" },
  role: { fontSize: 16, color: "#fff", marginBottom: 10 },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  infoText: { fontSize: 14, color: "#555", marginLeft: 10 },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutButtonText: { color: "#fff", fontWeight: "600" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 10, fontSize: 16, color: "gray" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalBackground: { position: "absolute", width: "100%", height: "100%" },
  zoomedImage: { width: "90%", height: "70%", borderRadius: 10 },
});
