import React, { useState, useEffect } from "react"; 
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BlurView } from '@react-native-community/blur';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useAuth } from "../../../navigations";

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setUserToken } = useAuth();

  useEffect(() => {
    const loadProfileFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          navigation.replace("LoginScreen");
          return;
        }

        const userName = await AsyncStorage.getItem("userName");
        const userEmail = await AsyncStorage.getItem("userEmail");
        const userRole = await AsyncStorage.getItem("userRole");
        const userImage = await AsyncStorage.getItem("userImage"); // optional, if you saved it

        const userData = {
          name: userName || "User",
          email: userEmail || "—",
          role: userRole || "—",
          image: userImage || null,
        };

        setProfile(userData);
      } catch (error) {
        Alert.alert("Error", "Failed to load profile from storage!");
      } finally {
        setLoading(false);
      }
    };

    loadProfileFromStorage();
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            setUserToken(null);
          } catch (err) {
            Alert.alert("Error", "Failed to logout. Try again!");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5A77A5" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="person-circle-outline" size={90} color="#999" />
        <Text style={styles.loadingText}>No Profile Found</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#E0F7FA", "#0F233D"]} style={styles.container}>
      
      {/* Profile Picture */}
      <View style={styles.profileContainer}>
        {profile.image ? (
          <Image source={{ uri: profile.image }} style={styles.profilePic} />
        ) : (
          <Ionicons name="person-circle-outline" size={scale(120)} color="#000" />
        )}
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        {Platform.OS === 'ios' && (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="rgba(255,255,255,0.95)"
          />
        )}

        <View style={styles.infoItem}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{profile.name?.trim() || "User"}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{profile.role || "—"}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile.email || "—"}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: verticalScale(70),
  },
  profileContainer: {
    marginBottom: verticalScale(30),
    alignItems: 'center',
  },
  profilePic: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  infoCard: {
    width: '85%',
    backgroundColor: '#fdfdfd',
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(25),
    paddingHorizontal: scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(6) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(12),
    elevation: 10,
    alignItems: 'center',
  },
  infoItem: {
    width: '100%',
    marginBottom: verticalScale(15),
  },
  label: {
    fontSize: moderateScale(13),
    color: '#888',
    marginBottom: verticalScale(3),
  },
  value: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#111',
  },
  logoutButton: {
    marginTop: verticalScale(15),
    width: '60%',
    backgroundColor: 'rgba(255,77,77,0.9)',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(25),
    alignItems: 'center',
    shadowColor: '#ff4d4d',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(8),
    elevation: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF2F5",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#555" },
});
