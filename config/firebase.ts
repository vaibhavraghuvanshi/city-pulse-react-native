// Mock Firebase implementation for a0.dev environment
// This provides the same API as Firebase but uses localStorage for persistence

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Mock Firebase User interface
export interface MockFirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Mock Firebase Auth Error
export class MockFirebaseError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'FirebaseError';
  }
}

// Mock Auth State Change Listener
type AuthStateChangeCallback = (user: MockFirebaseUser | null) => void;
let authStateListeners: AuthStateChangeCallback[] = [];
let currentUser: MockFirebaseUser | null = null;

// Mock Users Database (in-memory for demo)
const mockUsersDB: { [key: string]: any } = {};

// Mock Firebase Auth functions
export const signInWithEmailAndPassword = async (auth: any, email: string, password: string): Promise<{ user: MockFirebaseUser }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const userKey = `user_${email.toLowerCase()}`;
  const storedUser = await AsyncStorage.getItem(userKey);
  
  if (!storedUser) {
    throw new MockFirebaseError('auth/user-not-found', 'No account found with this email address');
  }
  
  const userData = JSON.parse(storedUser);
  if (userData.password !== password) {
    throw new MockFirebaseError('auth/wrong-password', 'Incorrect password');
  }
  
  const user: MockFirebaseUser = {
    uid: userData.uid,
    email: userData.email,
    displayName: userData.displayName || null,
  };
  
  currentUser = user;
  
  // Update last login
  userData.lastLoginAt = new Date().toISOString();
  await AsyncStorage.setItem(userKey, JSON.stringify(userData));
  
  // Store current user
  await AsyncStorage.setItem('currentUser', JSON.stringify(user));
  
  // Notify listeners
  authStateListeners.forEach(callback => callback(user));
  
  return { user };
};

export const createUserWithEmailAndPassword = async (auth: any, email: string, password: string): Promise<{ user: MockFirebaseUser }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const userKey = `user_${email.toLowerCase()}`;
  const existingUser = await AsyncStorage.getItem(userKey);
  
  if (existingUser) {
    throw new MockFirebaseError('auth/email-already-in-use', 'An account with this email already exists');
  }
  
  if (password.length < 6) {
    throw new MockFirebaseError('auth/weak-password', 'Password should be at least 6 characters');
  }
  
  const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const user: MockFirebaseUser = {
    uid,
    email,
    displayName: null,
  };
  
  const userData = {
    uid,
    email,
    password, // In real app, this would be hashed
    displayName: '',
    profileImage: '',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  
  // Store user data
  await AsyncStorage.setItem(userKey, JSON.stringify(userData));
  
  currentUser = user;
  
  // Store current user
  await AsyncStorage.setItem('currentUser', JSON.stringify(user));
  
  // Notify listeners
  authStateListeners.forEach(callback => callback(user));
  
  return { user };
};

export const signOut = async (auth: any): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  currentUser = null;
  await AsyncStorage.removeItem('currentUser');
  
  // Notify listeners
  authStateListeners.forEach(callback => callback(null));
};

export const onAuthStateChanged = (auth: any, callback: AuthStateChangeCallback): () => void => {
  authStateListeners.push(callback);
  
  // Check for existing user on initialization
  AsyncStorage.getItem('currentUser').then(userData => {
    if (userData) {
      const user = JSON.parse(userData);
      currentUser = user;
      callback(user);
    } else {
      callback(null);
    }
  }).catch(() => callback(null));
  
  // Return unsubscribe function
  return () => {
    const index = authStateListeners.indexOf(callback);
    if (index > -1) {
      authStateListeners.splice(index, 1);
    }
  };
};

// Mock Firestore functions
export const doc = (db: any, collection: string, docId: string) => ({
  collection,
  docId,
});

export const setDoc = async (docRef: any, data: any): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const key = `${docRef.collection}_${docRef.docId}`;
  const docData = {
    ...data,
    createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString() : data.createdAt,
    lastLoginAt: data.lastLoginAt instanceof Date ? data.lastLoginAt.toISOString() : data.lastLoginAt,
  };
  
  await AsyncStorage.setItem(key, JSON.stringify(docData));
  mockUsersDB[key] = docData;
};

export const getDoc = async (docRef: any): Promise<{ exists: () => boolean; data: () => any }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const key = `${docRef.collection}_${docRef.docId}`;
  const data = await AsyncStorage.getItem(key);
  
  return {
    exists: () => !!data,
    data: () => data ? JSON.parse(data) : null,
  };
};

export const updateDoc = async (docRef: any, updates: any): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const key = `${docRef.collection}_${docRef.docId}`;
  const existingData = await AsyncStorage.getItem(key);
  
  if (existingData) {
    const parsedData = JSON.parse(existingData);
    const updatedData = { ...parsedData, ...updates };
    
    // Handle Date objects
    Object.keys(updatedData).forEach(k => {
      if (updatedData[k] instanceof Date) {
        updatedData[k] = updatedData[k].toISOString();
      }
    });
    
    await AsyncStorage.setItem(key, JSON.stringify(updatedData));
    mockUsersDB[key] = updatedData;
  }
};

// Mock Firebase app and services
export const auth = {
  currentUser,
};

export const db = {
  // Mock db object
};

// Re-export User type
export type User = MockFirebaseUser;

export default {
  auth,
  db,
};