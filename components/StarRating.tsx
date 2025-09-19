import React, { useRef, useState } from 'react';
import { View, PanResponder, StyleSheet, Animated, Text } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export function StarRating({ rating, onChange, size = 24, readonly = false }: StarRatingProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme, size);
  const [isDragging, setIsDragging] = useState(false);
  const sliderWidth = 200;
  const thumbPosition = useRef(new Animated.Value((rating - 1) * (sliderWidth / 4))).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !readonly,
    onMoveShouldSetPanResponder: () => !readonly,
    onPanResponderGrant: () => {
      setIsDragging(true);
    },
    onPanResponderMove: (_, gestureState) => {
      if (readonly) return;
      
      const newPosition = Math.max(0, Math.min(sliderWidth, gestureState.moveX - gestureState.x0 + (rating - 1) * (sliderWidth / 4)));
      thumbPosition.setValue(newPosition);
      
      const newRating = Math.round((newPosition / sliderWidth) * 4) + 1;
      const clampedRating = Math.max(1, Math.min(5, newRating));
      
      if (onChange && clampedRating !== rating) {
        onChange(clampedRating);
      }
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
      const finalPosition = (rating - 1) * (sliderWidth / 4);
      Animated.spring(thumbPosition, {
        toValue: finalPosition,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    },
  });

  React.useEffect(() => {
    const finalPosition = (rating - 1) * (sliderWidth / 4);
    if (!isDragging) {
      Animated.spring(thumbPosition, {
        toValue: finalPosition,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [rating, isDragging, thumbPosition, sliderWidth]);

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        {/* Track */}
        <View style={styles.track} />
        
        {/* Active track */}
        <View 
          style={[
            styles.activeTrack, 
            { width: (rating - 1) * (sliderWidth / 4) + 12 }
          ]} 
        />
        
        {/* Tick marks */}
        {[1, 2, 3, 4, 5].map((tick) => (
          <View
            key={tick}
            style={[
              styles.tickMark,
              {
                left: (tick - 1) * (sliderWidth / 4) + 6,
                backgroundColor: tick <= rating ? theme.colors.accent : theme.colors.border,
              },
            ]}
          />
        ))}
        
        {/* Thumb */}
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: thumbPosition }],
              backgroundColor: isDragging ? theme.colors.accent : theme.colors.text,
              elevation: isDragging ? 4 : 2,
            },
          ]}
          {...(readonly ? {} : panResponder.panHandlers)}
        />
      </View>
      
      {/* Rating labels */}
      <View style={styles.labelsContainer}>
        {[1, 2, 3, 4, 5].map((label) => (
          <Text
            key={label}
            style={[
              styles.label,
              {
                color: label <= rating ? theme.colors.text : theme.colors.textTertiary,
                fontWeight: label === rating ? theme.fontWeight.semibold : theme.fontWeight.regular,
              },
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: any, size: number) => StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  sliderContainer: {
    width: 200,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    position: 'absolute',
    left: 6,
    right: 6,
  },
  activeTrack: {
    height: 4,
    backgroundColor: theme.colors.accent,
    borderRadius: 2,
    position: 'absolute',
    left: 6,
  },
  tickMark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: 14,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    top: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: theme.spacing.sm,
    paddingHorizontal: 6,
  },
  label: {
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    minWidth: 20,
  },
});