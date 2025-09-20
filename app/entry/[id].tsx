import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Calendar, Leaf, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/use-theme';
import { useEntries } from '@/hooks/use-entries';
import { StarRating } from '@/components/StarRating';


export default function EntryDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const { getEntry, deleteEntry } = useEntries();
  const entry = getEntry(id as string);
  const [isDeleting, setIsDeleting] = useState(false);

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
              console.log('Delete button pressed for entry ID:', id);
              deleteEntry(id as string);
              console.log('Delete function called, navigating back');
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

  const styles = createStyles(theme);

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Entry not found</Text>
      </View>
    );
  }

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
          <Calendar size={16} color={theme.colors.textSecondary} />
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



        {entry.effects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Effects</Text>
            <View style={styles.effectsGrid}>
              {entry.effects.map(effect => (
                <View 
                  key={effect.name}
                  style={styles.effectChip}
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
          <Trash2 size={18} color={theme.colors.error} />
          <Text style={styles.deleteButtonText}>
            {isDeleting ? 'Deleting...' : 'Delete Entry'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  content: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
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
    fontWeight: '300',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  strainType: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontWeight: '300',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  date: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
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
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: '300',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: '300',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '300',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    letterSpacing: -0.3,
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  effectName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: '300',
  },
  intensityDots: {
    flexDirection: 'row',
    gap: 2,
  },
  intensityDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.border,
  },
  intensityDotActive: {
    backgroundColor: theme.colors.text,
  },
  notes: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    fontWeight: '300',
  },
  additionalRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  additionalLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: '300',
  },
  additionalValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '300',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  deleteButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '300',
    color: theme.colors.error,
  },
});