import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

interface CommunityContextType {
  joinedCommunities: string[];
  joinCommunity: (communityId: string) => Promise<void>;
  leaveCommunity: (communityId: string) => Promise<void>;
  isJoined: (communityId: string) => boolean;
  isLoading: boolean;
}

const STORAGE_KEY = 'joined_communities';

export const [CommunityProvider, useCommunities] = createContextHook<CommunityContextType>(() => {
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadJoinedCommunities = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setJoinedCommunities(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load joined communities:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJoinedCommunities();
  }, [loadJoinedCommunities]);

  const saveJoinedCommunities = useCallback(async (communities: string[]) => {
    if (!Array.isArray(communities)) return;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(communities));
    } catch (error) {
      console.error('Failed to save joined communities:', error);
    }
  }, []);

  const joinCommunity = useCallback(async (communityId: string) => {
    if (!communityId?.trim()) return;
    if (!joinedCommunities.includes(communityId)) {
      const updated = [...joinedCommunities, communityId];
      setJoinedCommunities(updated);
      await saveJoinedCommunities(updated);
    }
  }, [joinedCommunities, saveJoinedCommunities]);

  const leaveCommunity = useCallback(async (communityId: string) => {
    if (!communityId?.trim()) return;
    const updated = joinedCommunities.filter(id => id !== communityId);
    setJoinedCommunities(updated);
    await saveJoinedCommunities(updated);
  }, [joinedCommunities, saveJoinedCommunities]);

  const isJoined = useCallback((communityId: string) => {
    if (!communityId?.trim()) return false;
    return joinedCommunities.includes(communityId);
  }, [joinedCommunities]);

  return useMemo(() => ({
    joinedCommunities,
    joinCommunity,
    leaveCommunity,
    isJoined,
    isLoading,
  }), [joinedCommunities, joinCommunity, leaveCommunity, isJoined, isLoading]);
});