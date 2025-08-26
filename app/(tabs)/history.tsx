import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Filter, Calendar } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useEntries } from '@/hooks/use-entries';
import { EntryCard } from '@/components/EntryCard';

export default function HistoryScreen() {
  const { entries } = useEntries();
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

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={theme.colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search strains or notes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.textLight}
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
            <Calendar size={48} color={theme.colors.textLight} />
            <Text style={styles.emptyTitle}>No entries found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || selectedType || selectedMethod 
                ? 'Try adjusting your filters'
                : 'Start tracking to see your history'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadow,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  filtersContainer: {
    maxHeight: 50,
    paddingHorizontal: theme.spacing.lg,
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
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  filterDivider: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  entriesList: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  resultsCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 3,
  },
  emptyTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});