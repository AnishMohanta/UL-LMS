import React, { useState } from "react"; 
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { ScrollView } from "react-native-gesture-handler";
import { register_url } from "../api/ApiEndPoints";


// Validation schema
const ValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      // "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      //     /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
      // 'Password must contain lowercase, number & special character'
         /^(?=.*[a-z])(?=.*\d)/,
      'Password must contain lowercase & number'
    )
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
});

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await fetch(register_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        }),
      });

      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text); } catch(e) {}

      if (response.status === 201) {
        Alert.alert("Success", `Registration successful! Welcome ${data.name}`);
        resetForm(); // Reset form only on success
        navigation.replace("Login");
      } else {
        Alert.alert("Registration Failed", data.message || text);
      }

    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient colors={["#CFE7F0", "#09203F"]} style={{ flex: 1 }}>
          <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Registration</Text>

            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                role: "Student",
              }}
              validationSchema={ValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#666"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                  />
                  {errors.name && touched.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    autoCapitalize="none"
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  <View style={styles.dropdownContainer}>
                    <Picker
                      selectedValue={values.role}
                      onValueChange={(itemValue) => setFieldValue("role", itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Student" value="Student" />
                      <Picker.Item label="Instructor" value="Instructor" />
                    </Picker>
                  </View>
                  {errors.role && touched.role && (
                    <Text style={styles.errorText}>{errors.role}</Text>
                  )}

                  <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.6 }]}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Submit</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </SafeAreaView>
        </LinearGradient>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '100%',
  },
  picker: { color: '#000' },
  button: {
    backgroundColor:"#09203F",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ffffffff', fontSize: 12, marginBottom: 5 },
});
