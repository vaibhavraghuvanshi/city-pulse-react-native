import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserProfile = () => {
  const [profileImage, setProfileImageState] = useState<string | null>(null);
  const [userName, setUserNameState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedImage = await AsyncStorage.getItem('userProfileImage');
        const storedName = await AsyncStorage.getItem('userName');
        
        if (storedImage) {
          setProfileImageState(storedImage);
        }
        
        if (storedName) {
          setUserNameState(storedName);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Set profile image
  const setProfileImage = async (imageUri: string) => {
    try {
      await AsyncStorage.setItem('userProfileImage', imageUri);
      setProfileImageState(imageUri);
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  // Set user name
  const setUserName = async (name: string) => {
    try {
      await AsyncStorage.setItem('userName', name);
      setUserNameState(name);
    } catch (error) {
      console.error('Error saving user name:', error);
    }
  };

  // Clear profile data (on logout)
  const clearProfileData = async () => {
    try {
      await AsyncStorage.removeItem('userProfileImage');
      await AsyncStorage.removeItem('userName');
      setProfileImageState(null);
      setUserNameState(null);
    } catch (error) {
      console.error('Error clearing profile data:', error);
    }
  };

  return {
    profileImage,
    userName,
    loading,
    setProfileImage,
    setUserName,
    clearProfileData,
  };
};