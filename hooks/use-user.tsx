import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: Date;
  preferences: {
    notifications: {
      sessionReminders: boolean;
      weeklyInsights: boolean;
      newFeatures: boolean;
    };
    theme: 'light' | 'dark' | 'system';
  };
}

const STORAGE_KEY = 'cannabis_user_profile';

const defaultProfile: UserProfile = {
  id: 'default-user',
  name: 'Cannabis Enthusiast',
  email: 'user@example.com',
  joinedDate: new Date(),
  preferences: {
    notifications: {
      sessionReminders: true,
      weeklyInsights: false,
      newFeatures: true,
    },
    theme: 'system',
  },
};

export const [UserProvider, useUser] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const profileQuery = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert joinedDate back to Date object
        parsed.joinedDate = new Date(parsed.joinedDate);
        return parsed;
      }
      return defaultProfile;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (profile: UserProfile) => {
      console.log('Saving user profile:', profile);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      console.error('Save profile error:', error);
    }
  });

  const { mutate: saveProfile } = saveMutation;

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
      setIsAuthenticated(true);
    }
  }, [profileQuery.data]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    saveProfile(updated);
  }, [profile, saveProfile]);

  const updateNotificationPreference = useCallback((key: keyof UserProfile['preferences']['notifications'], value: boolean) => {
    const updated = {
      ...profile,
      preferences: {
        ...profile.preferences,
        notifications: {
          ...profile.preferences.notifications,
          [key]: value
        }
      }
    };
    setProfile(updated);
    saveProfile(updated);
  }, [profile, saveProfile]);

  const updateThemePreference = useCallback((theme: 'light' | 'dark' | 'system') => {
    const updated = {
      ...profile,
      preferences: {
        ...profile.preferences,
        theme
      }
    };
    setProfile(updated);
    saveProfile(updated);
  }, [profile, saveProfile]);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setProfile(defaultProfile);
    setIsAuthenticated(false);
    queryClient.clear();
  }, [queryClient]);

  const signIn = useCallback((userProfile: Partial<UserProfile>) => {
    const newProfile = { ...defaultProfile, ...userProfile, id: userProfile.id || Date.now().toString() };
    setProfile(newProfile);
    setIsAuthenticated(true);
    saveProfile(newProfile);
  }, [saveProfile]);

  return useMemo(() => ({
    profile,
    isAuthenticated,
    updateProfile,
    updateNotificationPreference,
    updateThemePreference,
    signIn,
    signOut,
    isLoading: profileQuery.isLoading,
    isSaving: saveMutation.isPending
  }), [profile, isAuthenticated, updateProfile, updateNotificationPreference, updateThemePreference, signIn, signOut, profileQuery.isLoading, saveMutation.isPending]);
});

export type { UserProfile };