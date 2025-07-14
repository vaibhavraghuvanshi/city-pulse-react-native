import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';


import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import firebaseApp from '../config/firebaseConfig'; // Ensure this exports your initialized Firebase app

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const useAuth = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
      await SecureStore.setItemAsync('userEmail', email);
      await SecureStore.setItemAsync('userPassword', password);
      await SecureStore.setItemAsync('biometricEnabled', 'true');
      return userCredential.user;
    } catch (error: any) {
      throw new Error('Login failed: ' + (error?.message || 'Unknown error'));
    }
  };

  // Register
  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: null,
        emailVerified: userCredential.user.emailVerified,
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      setUser(userData);
      await AsyncStorage.setItem('lastLoggedInEmail', email);
      return userCredential.user;
    } catch (error: any) {
      throw new Error('Registration failed: ' + (error?.message || 'Unknown error'));
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('lastLoggedInEmail');
      setUser(null);
    } catch (error: any) {
      throw new Error('Logout failed: ' + (error?.message || 'Unknown error'));
    }
  };

  // Biometric Login
  // const loginWithBiometrics = async (): Promise<any> => {
  //   try {
  //     const compatible = await LocalAuthentication.hasHardwareAsync();
  //     if (!compatible) {
  //       throw new Error('Biometric hardware not supported.');
  //     }

  //     const enrolled = await LocalAuthentication.isEnrolledAsync();
  //     if (!enrolled) {
  //       throw new Error('No biometric credentials found.');
  //     }

  //     const result = await LocalAuthentication.authenticateAsync({
  //       promptMessage: 'Authenticate with Biometrics',
  //       fallbackLabel: 'Enter Password',
  //     });

  //     if (!result.success) {
  //       throw new Error('Biometric authentication failed.');
  //     }

  //     const savedEmail = await AsyncStorage.getItem('lastLoggedInEmail');
  //     if (!savedEmail) {
  //       throw new Error('No saved credentials found.');
  //     }

  //     // You may store a generic password or use secure storage
  //     const hardcodedPassword = 'yourDefaultPassword'; // Consider using SecureStore for real apps

  //     return await login(savedEmail, hardcodedPassword);
  //   } catch (error: any) {
  //     throw new Error('Biometric login failed: ' + (error?.message || 'Unknown error'));
  //   }
  // };

  const loginWithBiometrics = async (): Promise<any> => {
  try {
    // ✅ Check device compatibility
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      throw new Error('Biometric hardware not supported.');
    }

    // ✅ Check if biometrics are enrolled
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      throw new Error('No biometric credentials found.');
    }

    // ✅ Prompt user to authenticate
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Biometrics',
      fallbackLabel: 'Enter Password',
    });

    if (!result.success) {
      throw new Error('Biometric authentication failed.');
    }

    // ✅ Retrieve stored credentials securely
    const savedEmail = await SecureStore.getItemAsync('userEmail');
    const savedPassword = await SecureStore.getItemAsync('userPassword');

    if (!savedEmail || !savedPassword) {
      throw new Error('No saved credentials found.');
    }

    // ✅ Attempt login using retrieved credentials
    return await login(savedEmail, savedPassword);
  } catch (error: any) {
    throw new Error('Biometric login failed: ' + (error?.message || 'Unknown error'));
  }
};


  return {
    user,
    loading,
    login,
    register,
    logout,
    loginWithBiometrics,
  };
};
