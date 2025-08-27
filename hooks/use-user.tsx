import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

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
      communityUpdates: boolean;
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
      communityUpdates: true,
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
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem(STORAGE_KEY);
      setProfile(defaultProfile);
      setIsAuthenticated(false);
      queryClient.clear();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }, [queryClient]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch or create user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        const userProfile: UserProfile = {
          id: data.user.id,
          name: profileData?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          avatar: profileData?.avatar_url,
          joinedDate: new Date(data.user.created_at),
          preferences: {
            notifications: {
              sessionReminders: true,
              weeklyInsights: false,
              communityUpdates: true,
              newFeatures: true,
            },
            theme: 'system',
          },
        };

        setProfile(userProfile);
        setIsAuthenticated(true);
        saveProfile(userProfile);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }, [saveProfile]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email || '',
            name,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        const userProfile: UserProfile = {
          id: data.user.id,
          name,
          email: data.user.email || '',
          joinedDate: new Date(data.user.created_at),
          preferences: {
            notifications: {
              sessionReminders: true,
              weeklyInsights: false,
              communityUpdates: true,
              newFeatures: true,
            },
            theme: 'system',
          },
        };

        setProfile(userProfile);
        setIsAuthenticated(true);
        saveProfile(userProfile);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }, [saveProfile]);

  // Check for existing session on app start
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // User is already signed in, fetch their profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData }) => {
            if (profileData) {
              const userProfile: UserProfile = {
                id: session.user.id,
                name: profileData.name,
                email: session.user.email || '',
                avatar: profileData.avatar_url,
                joinedDate: new Date(session.user.created_at),
                preferences: {
                  notifications: {
                    sessionReminders: true,
                    weeklyInsights: false,
                    communityUpdates: true,
                    newFeatures: true,
                  },
                  theme: 'system',
                },
              };
              setProfile(userProfile);
              setIsAuthenticated(true);
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setProfile(defaultProfile);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return useMemo(() => ({
    profile,
    isAuthenticated,
    updateProfile,
    updateNotificationPreference,
    updateThemePreference,
    signIn,
    signUp,
    signOut,
    isLoading: profileQuery.isLoading,
    isSaving: saveMutation.isPending
  }), [profile, isAuthenticated, updateProfile, updateNotificationPreference, updateThemePreference, signIn, signUp, signOut, profileQuery.isLoading, saveMutation.isPending]);
});

export type { UserProfile };