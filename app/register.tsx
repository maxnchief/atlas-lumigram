import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateAccount = async () => {
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Signed up
      const user = userCredential.user;
      router.replace('/(tabs)'); // Redirect to home tab
    } catch (error) {
      let message = 'Registration failed. Please check your details.';
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'auth/email-already-in-use') {
          message = 'Email is already in use.';
        } else if (error.code === 'auth/invalid-email') {
          message = 'Invalid email address.';
        } else if (error.code === 'auth/weak-password') {
          message = 'Password should be at least 6 characters.';
        }
      }
      setError(message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#070B3A' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.loginTitle}>Create Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#3DE6C1"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#3DE6C1"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.signInText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.createAccountText}>Login to an existing account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logoImage: {
    width: 320,
    height: 120,
    marginBottom: 32,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
    marginTop: 8,
  },
  input: {
    width: '100%',
    height: 56,
    borderColor: '#3DE6C1',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 18,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  signInButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#3DE6C1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  signInText: {
    color: '#070B3A',
    fontSize: 22,
    fontWeight: 'bold',
  },
  createAccountButton: {
    width: '100%',
    height: 56,
    borderColor: '#3DE6C1',
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  createAccountText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  errorText: {
    color: '#FF4C4C',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
});