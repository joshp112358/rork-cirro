import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { LucideIcon } from 'lucide-react-native';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

export function ActionButton({ 
  title, 
  onPress, 
  icon: Icon, 
  variant = 'primary', 
  size = 'medium',
  loading = false,
  disabled = false,
  style 
}: ActionButtonProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme, variant, size);

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        isDisabled && styles.buttonDisabled,
        style
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <>
          <ActivityIndicator size="small" color={styles.text.color} />
          <Text style={styles.text}>Loading...</Text>
        </>
      ) : (
        <>
          {Icon && <Icon size={styles.iconSize} color={styles.text.color} strokeWidth={1.5} />}
          <Text style={styles.text}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme: any, variant: string, size: string) => {
  const sizeConfig = {
    small: {
      padding: theme.spacing.sm,
      fontSize: theme.fontSize.sm,
      iconSize: 16,
    },
    medium: {
      padding: theme.spacing.md,
      fontSize: theme.fontSize.md,
      iconSize: 18,
    },
    large: {
      padding: theme.spacing.lg,
      fontSize: theme.fontSize.lg,
      iconSize: 20,
    },
  };

  const variantConfig = {
    primary: {
      backgroundColor: theme.colors.text,
      borderColor: theme.colors.text,
      textColor: theme.colors.background,
    },
    secondary: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      textColor: theme.colors.text,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border,
      textColor: theme.colors.text,
    },
  };

  const config = sizeConfig[size as keyof typeof sizeConfig];
  const colors = variantConfig[variant as keyof typeof variantConfig];

  return StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: colors.backgroundColor,
      borderRadius: theme.borderRadius.sm,
      paddingVertical: config.padding,
      paddingHorizontal: theme.spacing.xl,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    text: {
      fontSize: config.fontSize,
      fontWeight: theme.fontWeight.light,
      color: colors.textColor,
    },
    iconSize: config.iconSize,
  });
};