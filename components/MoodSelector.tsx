import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { MOOD_LABELS } from '@/types/entry';

interface MoodSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const screenWidth = Dimensions.get('window').width;
  const sliderWidth = Math.min(300, screenWidth - 80); // Responsive width with padding
  const stepWidth = sliderWidth / 4; // 4 steps between 5 marks
  
  const pan = useRef(new Animated.Value((value - 1) * stepWidth)).current;
  const [currentPosition, setCurrentPosition] = useState<number>((value - 1) * stepWidth);

  useEffect(() => {
    const newPosition = (value - 1) * stepWidth;
    setCurrentPosition(newPosition);
    Animated.spring(pan, {
      toValue: newPosition,
      useNativeDriver: false,
      tension: 120,
      friction: 7,
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
        tension: 120,
        friction: 7,
      }).start();
      
      const newMood = Math.max(1, Math.min(5, nearestStep + 1));
      onChange(newMood);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Overall Mood</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.valueMax}>/5</Text>
        </View>
      </View>
      
      <View style={[styles.sliderContainer, { width: sliderWidth + 40 }]}>
        {/* Track */}
        <View style={[styles.track, { width: sliderWidth }]} />
        
        {/* Active track */}
        <View 
          style={[
            styles.activeTrack, 
            { 
              width: ((value - 1) / 4) * sliderWidth,
            }
          ]} 
        />
        
        {/* Marks */}
        {[1, 2, 3, 4, 5].map((mark, index) => (
          <View
            key={mark}
            style={[
              styles.mark,
              { left: index * stepWidth + 20 }, // 20px offset for container padding
              value >= mark && styles.markActive
            ]}
          >
            <Text style={[
              styles.markLabel,
              value >= mark && styles.markLabelActive
            ]}>
              {mark}
            </Text>
          </View>
        ))}
        
        {/* Slider thumb */}
        <Animated.View
          style={[
            styles.thumb,
            {
              left: 20, // Match container padding
              transform: [{ translateX: pan }],
            },
          ]}
          {...panResponder.panHandlers}
        />
      </View>
      
      {value > 0 && (
        <View style={styles.moodLabelContainer}>
          <Text style={styles.moodLabel}>
            {MOOD_LABELS[value as keyof typeof MOOD_LABELS]}
          </Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.accent,
  },
  valueMax: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.regular,
    color: theme.colors.textSecondary,
    marginLeft: 2,
  },
  sliderContainer: {
    height: 80,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  track: {
    height: 6,
    backgroundColor: theme.colors.borderSecondary,
    borderRadius: 3,
    position: 'absolute',
    top: 37, // Center vertically
  },
  activeTrack: {
    height: 6,
    backgroundColor: theme.colors.accent,
    borderRadius: 3,
    position: 'absolute',
    top: 37, // Center vertically
  },
  mark: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.border,
    top: 24, // Center on track
    marginLeft: -16, // Center the mark
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.small,
  },
  markActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
    ...theme.shadow.medium,
  },
  markLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  markLabelActive: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.bold,
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.accent,
    top: 26, // Center on track
    marginLeft: -14, // Center the thumb
    borderWidth: 3,
    borderColor: theme.colors.background,
    ...theme.shadow.large,
  },
  moodLabelContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  moodLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.accent,
    textAlign: 'center',
  },
});