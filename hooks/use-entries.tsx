import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { JournalEntry } from '@/types/entry';

const STORAGE_KEY = 'cannabis_journal_entries';

export const [EntriesProvider, useEntries] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const entriesQuery = useQuery({
    queryKey: ['entries'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (entries: JournalEntry[]) => {
      console.log('Saving entries to AsyncStorage:', entries.length);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      console.log('Entries saved successfully');
      return entries;
    },
    onSuccess: (data) => {
      console.log('Save mutation success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['entries'] });
    },
    onError: (error) => {
      console.error('Save mutation error:', error);
    }
  });

  useEffect(() => {
    if (entriesQuery.data) {
      setEntries(entriesQuery.data);
    }
  }, [entriesQuery.data]);

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    console.log('Adding entry:', entry);
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    console.log('New entry created:', newEntry);
    const updated = [newEntry, ...entries];
    console.log('Updated entries array:', updated.length);
    setEntries(updated);
    saveMutation.mutate(updated);
    console.log('Save mutation triggered');
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    const updated = entries.map(e => 
      e.id === id ? { ...e, ...updates } : e
    );
    setEntries(updated);
    saveMutation.mutate(updated);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    saveMutation.mutate(updated);
  };

  const getEntry = (id: string) => {
    return entries.find(e => e.id === id);
  };

  const analytics = useMemo(() => {
    if (entries.length === 0) return null;

    const totalSessions = entries.length;
    const avgRating = entries.reduce((sum, e) => sum + e.rating, 0) / totalSessions;
    
    const strainCounts = entries.reduce((acc, e) => {
      acc[e.strain.type] = (acc[e.strain.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Find preferred strain type
    const preferredStrainType = Object.entries(strainCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
    
    const preferredStrainPercentage = strainCounts[preferredStrainType] 
      ? Math.round((strainCounts[preferredStrainType] / totalSessions) * 100)
      : 0;

    const methodCounts = entries.reduce((acc, e) => {
      acc[e.method] = (acc[e.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topStrains = entries.reduce((acc, e) => {
      if (!acc[e.strain.name]) {
        acc[e.strain.name] = { count: 0, totalRating: 0 };
      }
      acc[e.strain.name].count++;
      acc[e.strain.name].totalRating += e.rating;
      return acc;
    }, {} as Record<string, { count: number; totalRating: number }>);

    const topEffects = entries.reduce((acc, e) => {
      e.effects.forEach(effect => {
        if (!acc[effect.name]) {
          acc[effect.name] = { count: 0, avgIntensity: 0 };
        }
        acc[effect.name].count++;
        acc[effect.name].avgIntensity += effect.intensity;
      });
      return acc;
    }, {} as Record<string, { count: number; avgIntensity: number }>);

    Object.keys(topEffects).forEach(key => {
      topEffects[key].avgIntensity /= topEffects[key].count;
    });

    return {
      totalSessions,
      avgRating,
      preferredStrainType,
      preferredStrainPercentage,
      strainCounts,
      methodCounts,
      topStrains,
      topEffects
    };
  }, [entries]);

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    analytics,
    isLoading: entriesQuery.isLoading,
    isSaving: saveMutation.isPending
  };
});

export function useRecentEntries(limit: number = 5) {
  const { entries } = useEntries();
  return useMemo(() => entries.slice(0, limit), [entries, limit]);
}

export function useEntriesByStrain(strainName: string) {
  const { entries } = useEntries();
  return useMemo(() => 
    entries.filter(e => e.strain.name === strainName),
    [entries, strainName]
  );
}