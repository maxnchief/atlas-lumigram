import React, { useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../../constants/firebase';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// TODO: Replace with actual user ID from auth context
const MOCK_USER_ID = 'user_123';

export default function AddPostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    if (!image) return;
    setUploading(true);
    setError(null);
    try {
      // Upload image to Firebase Storage
      const response = await fetch(image);
      const blob = await response.blob();
      const imageName = `${MOCK_USER_ID}_${Date.now()}`;
      const storageRef = ref(storage, `posts/${imageName}`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      // Save post to Firestore
      await addDoc(collection(db, 'posts'), {
        imageUrl,
        caption,
        createdAt: serverTimestamp(),
        createdBy: MOCK_USER_ID,
      });

      alert('Post saved!');
      setImage(null);
      setCaption('');
    } catch (err) {
      setError('Error uploading post: ' + (err?.message || err));
    }
    setUploading(false);
  };

  const handleReset = () => {
    setImage(null);
    setCaption('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fafafa' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Text style={styles.header}>Add Post</Text>
          <TouchableOpacity onPress={pickImage} style={styles.uploadIconBtn} accessibilityLabel="Pick image">
            <Text style={styles.uploadIcon}>⤴️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
              <Text style={{ color: '#bbb', fontSize: 18 }}>Select Image</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a caption"
            placeholderTextColor="#7ed6b5"
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={120}
          />
        </View>
        <TouchableOpacity
          style={[styles.saveButton, (!image || !caption.trim() || uploading) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!image || !caption.trim() || uploading}
        >
          <Text style={styles.saveButtonText}>{uploading ? 'Uploading...' : 'Save'}</Text>
        </TouchableOpacity>
        {error && (
          <View style={{ marginHorizontal: 20, marginTop: 8 }}>
            <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 32,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
  },
  uploadIconBtn: {
    padding: 8,
  },
  uploadIcon: {
    fontSize: 28,
    color: '#7ed6b5',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 32,
    backgroundColor: '#eee',
  },
  imagePlaceholder: {
    width: 320,
    height: 320,
    borderRadius: 32,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#7ed6b5',
    borderRadius: 8,
    padding: 16,
    fontSize: 20,
    backgroundColor: '#fff',
    color: '#222',
  },
  saveButton: {
    marginHorizontal: 20,
    backgroundColor: '#7ed6b5',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
    opacity: 1,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  resetButton: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  resetButtonText: {
    color: '#222',
    fontSize: 24,
    fontWeight: '400',
  },
});
