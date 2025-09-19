import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export function StarRating({ rating, onChange, size = 24, readonly = false }: StarRatingProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => !readonly && onChange?.(star)}
          disabled={readonly}
          testID={`star-${star}`}
          style={styles.starButton}
        >
          <Star
            size={size}
            color={star <= rating ? theme.colors.text : theme.colors.border}
            fill={star <= rating ? theme.colors.text : 'transparent'}
            strokeWidth={1.5}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  starButton: {
    padding: theme.spacing.xs,
  },
});