import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { MOOD_LABELS } from '@/types/entry';

interface MoodSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const sliderWidth = 280;
  const stepWidth = sliderWidth / 4; // 4 steps between 5 marks
  
  const pan = useRef(new Animated.Value((value - 1) * stepWidth)).current;
  const [currentPosition, setCurrentPosition] = useState<number>((value - 1) * stepWidth);

  useEffect(() => {
    const newPosition = (value - 1) * stepWidth;
    setCurrentPosition(newPosition);
    Animated.spring(pan, {
      toValue: newPosition,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [value, stepWidth, pan]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset(currentPosition);
      pan.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      const newValue = Math.max(-currentPosition, Math.min(sliderWidth - currentPosition, gestureState.dx));
      pan.setValue(newValue);
    },
    onPanResponderRelease: (_, gestureState) => {
      const finalPosition = Math.max(0, Math.min(sliderWidth, currentPosition + gestureState.dx));
      const nearestStep = Math.round(finalPosition / stepWidth);
      const snapPosition = nearestStep * stepWidth;
      
      pan.flattenOffset();
      setCurrentPosition(snapPosition);
      
      Animated.spring(pan, {
        toValue: snapPosition,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
      
      const newMood = Math.max(1, Math.min(5, nearestStep + 1));
      onChange(newMood);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Overall Mood</Text>
        <Text style={styles.value}>{value}/5</Text>
      </View>
      
      <View style={styles.sliderContainer}>
        {/* Track */}
        <View style={styles.track} />
        
        {/* Marks */}
        {[1, 2, 3, 4, 5].map((mark, index) => (
          <View
            key={mark}
            style={[
              styles.mark,
              { left: index * stepWidth + 10 }, // 10px offset for container padding
              value >= mark && styles.markActive
            ]}
          />
        ))}
        
        {/* Slider thumb */}
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: pan }],
            },
          ]}
          {...panResponder.panHandlers}
        />
      </View>
      
      {value > 0 && (
        <Text style={styles.moodLabel}>
          {MOOD_LABELS[value as keyof typeof MOOD_LABELS]}
        </Text>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
  },
  sliderContainer: {
    height: 60,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  track: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    width: 280,
  },
  mark: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
    top: 24, // Center on track
    marginLeft: -6, // Center the mark
  },
  markActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.text,
    top: 18, // Center on track
    marginLeft: -2, // Adjust for centering
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moodLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});