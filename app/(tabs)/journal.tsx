import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Search, Filter, Calendar, TrendingUp, BarChart3 } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useEntries } from '@/hooks/use-entries';
import { EntryCard } from '@/components/EntryCard';

export default function JournalScreen() {
  const { theme } = useTheme();
  const { entries, analytics } = useEntries();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.strain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.notes.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = !selectedType || entry.strain.type === selectedType;
      const matchesMethod = !selectedMethod || entry.method === selectedMethod;
      
      return matchesSearch && matchesType && matchesMethod;
    });
  }, [entries, searchQuery, selectedType, selectedMethod]);

  const types = ['Indica', 'Sativa', 'Hybrid', 'CBD'];
  const methods = ['Flower', 'Vape', 'Edible', 'Tincture'];

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Journal</Text>
        </View>

        {analytics && entries.length > 0 && (
          <View style={styles.analyticsSection}>
            <View style={styles.sectionHeader}>
              <BarChart3 size={18} color={theme.colors.primary} strokeWidth={1.5} />
              <Text style={styles.sectionTitle}>Analytics</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{analytics.totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{analytics.avgRating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Avg Rating</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[
                  styles.statValue,
                  { color: analytics.avgMoodImprovement > 0 ? theme.colors.primary : theme.colors.textSecondary }
                ]}>
                  {analytics.avgMoodImprovement > 0 ? '+' : ''}{analytics.avgMoodImprovement.toFixed(1)}
                </Text>
                <Text style={styles.statLabel}>Mood Change</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search strains or notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          <View style={styles.filterRow}>
            {types.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterChip,
                  selectedType === type && styles.filterChipActive
                ]}
                onPress={() => setSelectedType(selectedType === type ? null : type)}
              >
                <Text style={[
                  styles.filterText,
                  selectedType === type && styles.filterTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.filterDivider} />
            {methods.map(method => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.filterChip,
                  selectedMethod === method && styles.filterChipActive
                ]}
                onPress={() => setSelectedMethod(selectedMethod === method ? null : method)}
              >
                <Text style={[
                  styles.filterText,
                  selectedMethod === method && styles.filterTextActive
                ]}>
                  {method}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView 
          style={styles.entriesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.entriesContent}
        >
          {filteredEntries.length > 0 ? (
            <>
              <Text style={styles.resultsCount}>
                {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
              </Text>
              {filteredEntries.map(entry => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Calendar size={32} color={theme.colors.textSecondary} strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyTitle}>No entries found</Text>
              <Text style={styles.emptyText}>
                {searchQuery || selectedType || selectedMethod 
                  ? 'Try adjusting your filters'
                  : 'Start tracking to see your history'}
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.heavy,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  analyticsSection: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
  },
  filtersContainer: {
    maxHeight: 50,
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.round,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
  },
  filterTextActive: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.medium,
  },
  filterDivider: {
    width: 0.5,
    height: 20,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  entriesList: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  entriesContent: {
    paddingBottom: theme.spacing.lg,
  },
  resultsCount: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.sm,
    maxWidth: 280,
  },
});