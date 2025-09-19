import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { JournalEntry } from '@/types/entry';

const STORAGE_KEY = 'cannabis_journal_entries';

// Default filler entries
const DEFAULT_ENTRIES: JournalEntry[] = [
  {
    id: 'default-1',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    strain: {
      name: 'Girl Scout Cookies',
      type: 'Hybrid',
      thc: 28,
      cbd: 0.1
    },
    amount: 0.5,
    method: 'Flower',
    mood: { overall: 5 },
    effects: [
      { name: 'Relaxed', intensity: 4 },
      { name: 'Happy', intensity: 5 },
      { name: 'Euphoric', intensity: 4 },
      { name: 'Hungry', intensity: 3 }
    ],
    notes: 'Perfect evening strain. Sweet earthy flavor with hints of mint and cherry. Great for unwinding after a long day.',
    rating: 5
  },
  {
    id: 'default-2',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    strain: {
      name: 'Purple Haze',
      type: 'Sativa',
      thc: 22,
      cbd: 0.2
    },
    amount: 0.3,
    method: 'Vape',
    mood: { overall: 4 },
    effects: [
      { name: 'Creative', intensity: 5 },
      { name: 'Energetic', intensity: 4 },
      { name: 'Uplifted', intensity: 4 },
      { name: 'Focused', intensity: 3 }
    ],
    notes: 'Classic Hendrix strain! Amazing for creative projects. Berry and grape flavors with a smooth vape experience.',
    rating: 4
  },
  {
    id: 'default-3',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    strain: {
      name: 'Blue Dream',
      type: 'Hybrid',
      thc: 24,
      cbd: 0.3
    },
    amount: 1.0,
    method: 'Flower',
    mood: { overall: 4 },
    effects: [
      { name: 'Relaxed', intensity: 3 },
      { name: 'Happy', intensity: 4 },
      { name: 'Creative', intensity: 3 },
      { name: 'Pain Relief', intensity: 4 }
    ],
    notes: 'Balanced hybrid that\'s great for daytime use. Sweet berry aroma with smooth smoke. Perfect for social situations.',
    rating: 4
  },
  {
    id: 'default-4',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    strain: {
      name: 'OG Kush',
      type: 'Hybrid',
      thc: 26,
      cbd: 0.1
    },
    amount: 0.4,
    method: 'Dab',
    mood: { overall: 5 },
    effects: [
      { name: 'Relaxed', intensity: 5 },
      { name: 'Euphoric', intensity: 4 },
      { name: 'Couch Lock', intensity: 3 },
      { name: 'Sleepy', intensity: 2 }
    ],
    notes: 'The classic! Earthy pine flavor with citrus undertones. Perfect for evening relaxation and stress relief.',
    rating: 5
  },
  {
    id: 'default-5',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    strain: {
      name: 'Sour Diesel',
      type: 'Sativa',
      thc: 25,
      cbd: 0.2
    },
    amount: 0.6,
    method: 'Flower',
    mood: { overall: 4 },
    effects: [
      { name: 'Energetic', intensity: 5 },
      { name: 'Focused', intensity: 4 },
      { name: 'Uplifted', intensity: 4 },
      { name: 'Talkative', intensity: 3 }
    ],
    notes: 'Great wake and bake strain. Diesel aroma with citrus notes. Keeps me motivated and productive throughout the day.',
    rating: 4
  }
];

export const [EntriesProvider, useEntries] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const entriesQuery = useQuery({
    queryKey: ['entries'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const storedEntries = stored ? JSON.parse(stored) : [];
      
      // If no stored entries, return default entries
      if (storedEntries.length === 0) {
        // Convert timestamp strings back to Date objects for default entries
        const defaultWithDates = DEFAULT_ENTRIES.map(entry => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        return defaultWithDates;
      }
      
      // Convert timestamp strings back to Date objects for stored entries
      return storedEntries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
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