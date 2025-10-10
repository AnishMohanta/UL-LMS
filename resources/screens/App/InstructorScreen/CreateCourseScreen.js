import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker'; // ✅ added
import { all_courses_url } from '../../../api/ApiEndPoints'; // API endpoint

export default function CreateCourseScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState(''); // ✅ changed from imageUrl to imageUri
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
  try {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
    };
    const result = await launchImageLibrary(options);

    if (result.didCancel) return;
    const asset = result.assets?.[0];

    if (asset) {
      const fileType = asset.type?.toLowerCase();
      if (fileType && (fileType.endsWith('jpeg') || fileType.endsWith('jpg') || fileType.endsWith('png'))) {
        setImageUri(asset.uri);
      } else {
        Alert.alert('Invalid Format', 'Only JPG, JPEG, or PNG formats are allowed.');
      }
    }
  } catch (error) {
    console.error('Image Picker Error:', error);
    Alert.alert('Error', 'Failed to open image picker.');
  }
};

  const handleCreate = async () => {
  if (!title || !description || !category || !imageUri) {
    Alert.alert('Validation Error', 'Please fill all required fields and select an image.');
    return;
  }

  Alert.alert(
    'Confirm Course Creation',
    `Do you want to create "${title}" course?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          setLoading(true);
          try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('User not authenticated');

            // Create multipart form data
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);

            // Append image as file (backend expects it)
            formData.append('image', {
              uri: imageUri,
              type: 'image/jpeg', // you can dynamically detect later if needed
              name: `course_${Date.now()}.jpg`,
            });

            // Send POST request with multipart headers
            const response = await axios.post(all_courses_url, formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            });

            Alert.alert('Success', 'Course created successfully!');
            navigation.navigate('InstructorTab', { screen: 'Courses' });
           
          } catch (error) {
            console.error('Error creating course:', error);
            Alert.alert(
              'Error',
              error.response?.data?.message ||
                error.message ||
                'Failed to create course'
            );
          } finally {
            setLoading(false);
          }
        },
      },
    ]
  );
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f8', padding: 16 }}>
      <ScrollView>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#333', marginBottom: 16 }}>
          Create New Course
        </Text>

        <TextInput placeholder="Course Title" value={title} onChangeText={setTitle} style={inputStyle} />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ ...inputStyle, textAlignVertical: 'top' }}
        />
        <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={inputStyle} />

        {/* ✅ Image Picker Button */}
        <TouchableOpacity onPress={handleImagePick} style={[inputStyle, { justifyContent: 'center' }]}>
          <Text style={{ color: imageUri ? '#333' : '#888' }}>
            {imageUri ? 'Image Selected ✔️' : 'Select Image (JPG, JPEG, PNG)'}
          </Text>
        </TouchableOpacity>

        {/* ✅ Preview Selected Image */}
        {imageUri ? (
          <View style={{ alignItems: 'center', marginBottom: 15 }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 200, height: 120, borderRadius: 10, marginTop: 10 }}
              resizeMode="cover"
            />
          </View>
        ) : null}

        <TouchableOpacity
          style={{
            backgroundColor: '#09203F',
            paddingVertical: 15,
            paddingHorizontal: 60,
            borderRadius: 50,
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Create Course</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const inputStyle = {
  width: '100%',
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 15,
  backgroundColor: '#fff',
  fontSize: 16,
  borderWidth: 1,
  borderColor: '#ddd',
  marginBottom: 15,
};
