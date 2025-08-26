import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Calendar, Leaf, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';
import { useEntries } from '@/hooks/use-entries';
import { StarRating } from '@/components/StarRating';
import { MOOD_LABELS } from '@/types/entry';

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getEntry, deleteEntry } = useEntries();
  const entry = getEntry(id as string);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text>Entry not found</Text>
      </View>
    );
  }

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getMoodColor = (mood: number) => {
    switch (mood) {
      case 1: return theme.colors.moodTerrible;
      case 2: return theme.colors.moodBad;
      case 3: return theme.colors.moodOkay;
      case 4: return theme.colors.moodGood;
      case 5: return theme.colors.moodExcellent;
      default: return theme.colors.border;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              deleteEntry(id as string);
              if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              router.back();
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry. Please try again.');
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {entry.imageUri && (
        <Image source={{ uri: entry.imageUri }} style={styles.image} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.strainInfo}>
            <Leaf size={24} color={theme.colors.primary} />
            <View>
              <Text style={styles.strainName}>{entry.strain.name}</Text>
              <Text style={styles.strainType}>{entry.strain.type}</Text>
            </View>
          </View>
          <StarRating rating={entry.rating} readonly size={24} />
        </View>

        <View style={styles.dateRow}>
          <Calendar size={16} color={theme.colors.textLight} />
          <Text style={styles.date}>{formatDate(entry.timestamp)}</Text>
        </View>

        <View style={styles.infoGrid}>
          {entry.strain.thc && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>THC</Text>
              <Text style={styles.infoValue}>{entry.strain.thc}%</Text>
            </View>
          )}
          {entry.strain.cbd && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>CBD</Text>
              <Text style={styles.infoValue}>{entry.strain.cbd}%</Text>
            </View>
          )}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Amount</Text>
            <Text style={styles.infoValue}>{entry.amount}g</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Method</Text>
            <Text style={styles.infoValue}>{entry.method}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Journey</Text>
          <View style={styles.moodJourney}>
            <View style={styles.moodItem}>
              <Text style={styles.moodPhase}>Before</Text>
              <View style={[styles.moodIndicator, { backgroundColor: getMoodColor(entry.mood.before) }]} />
              <Text style={styles.moodLabel}>{MOOD_LABELS[entry.mood.before as keyof typeof MOOD_LABELS]}</Text>
            </View>
            <Text style={styles.moodArrow}>→</Text>
            <View style={styles.moodItem}>
              <Text style={styles.moodPhase}>During</Text>
              <View style={[styles.moodIndicator, { backgroundColor: getMoodColor(entry.mood.during) }]} />
              <Text style={styles.moodLabel}>{MOOD_LABELS[entry.mood.during as keyof typeof MOOD_LABELS]}</Text>
            </View>
            <Text style={styles.moodArrow}>→</Text>
            <View style={styles.moodItem}>
              <Text style={styles.moodPhase}>After</Text>
              <View style={[styles.moodIndicator, { backgroundColor: getMoodColor(entry.mood.after) }]} />
              <Text style={styles.moodLabel}>{MOOD_LABELS[entry.mood.after as keyof typeof MOOD_LABELS]}</Text>
            </View>
          </View>
        </View>

        {entry.effects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Effects</Text>
            <View style={styles.effectsGrid}>
              {entry.effects.map(effect => (
                <View 
                  key={effect.name}
                  style={[
                    styles.effectChip,
                    { backgroundColor: theme.colors.primary }
                  ]}
                >
                  <Text style={styles.effectName}>{effect.name}</Text>
                  <View style={styles.intensityDots}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <View
                        key={i}
                        style={[
                          styles.intensityDot,
                          i <= effect.intensity && styles.intensityDotActive
                        ]}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {entry.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{entry.notes}</Text>
          </View>
        )}

        {(entry.strain.brand || entry.strain.dispensary) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Info</Text>
            {entry.strain.brand && (
              <View style={styles.additionalRow}>
                <Text style={styles.additionalLabel}>Brand:</Text>
                <Text style={styles.additionalValue}>{entry.strain.brand}</Text>
              </View>
            )}
            {entry.strain.dispensary && (
              <View style={styles.additionalRow}>
                <Text style={styles.additionalLabel}>Dispensary:</Text>
                <Text style={styles.additionalValue}>{entry.strain.dispensary}</Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>
            {isDeleting ? 'Deleting...' : 'Delete Entry'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  strainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  strainName: {
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
  },
  strainType: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.secondary,
    marginTop: theme.spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  date: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadow,
  },
  infoLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600' as const,
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  moodJourney: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow,
  },
  moodItem: {
    alignItems: 'center',
  },
  moodPhase: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  moodIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: theme.spacing.sm,
  },
  moodLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600' as const,
    color: theme.colors.text,
  },
  moodArrow: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.textLight,
  },
  effectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  effectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
  },
  effectName: {
    fontSize: theme.fontSize.sm,
    color: '#fff',
    fontWeight: '600' as const,
  },
  intensityDots: {
    flexDirection: 'row',
    gap: 2,
  },
  intensityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  intensityDotActive: {
    backgroundColor: '#fff',
  },
  notes: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 24,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadow,
  },
  additionalRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  additionalLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  additionalValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '600' as const,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: '#dc3545',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  deleteButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600' as const,
    color: '#fff',
  },
});