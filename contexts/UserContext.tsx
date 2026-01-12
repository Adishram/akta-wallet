import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  name: string;
  profilePicture: string | null;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: 'User',
  profilePicture: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem('user_profile');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const newProfile = { ...profile, ...updates };
      setProfile(newProfile);
      await AsyncStorage.setItem('user_profile', JSON.stringify(newProfile));
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const clearProfile = async () => {
    try {
      setProfile(defaultProfile);
      await AsyncStorage.removeItem('user_profile');
    } catch (error) {
      console.error('Failed to clear profile:', error);
    }
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, clearProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
