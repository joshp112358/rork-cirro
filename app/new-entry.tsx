import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated
} from 'react-native';
import { Send } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/use-theme';
import { useEntries } from '@/hooks/use-entries';
import { FormSection, FormInput, FormHeader, ActionButton, ImageSelector } from '@/components/shared';

export default function NewEntryScreen() {
  const { theme } = useTheme();
  const { addEntry, isSaving } = useEntries();
  const [imageUri, setImageUri] = useState<string>('');
  const [isSavingEntry, setIsSavingEntry] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const [dispensary, setDispensary] = useState('');
  const [location, setLocation] = useState('');
  const [postContent, setPostContent] = useState('');







  const handleSave = async () => {
    // Validation: require either image or post content
    if (!imageUri && !postContent.trim()) {
      Alert.alert('Required', 'Please add either a photo or write some content for your post.');
      return;
    }

    setIsSavingEntry(true);

    console.log('Saving entry:', {
      dispensary,
      location,
      postContent,
      imageUri
    });

    try {
      const newEntry = addEntry({
        strain: {
          name: '',
          type: 'Hybrid',
          thc: undefined,
          thca: undefined,
          thcv: undefined,
          cbd: undefined,
          cbda: undefined,
          cbdv: undefined,
          brand: '',
          dispensary
        },
        amount: 0,
        method: 'Flower',
        mood: { overall: 3 },
        effects: [],
        notes: postContent,
        rating: 3,
        imageUri,
        location
      });

      console.log('Entry saved with ID:', newEntry.id);

      // Beautiful exit animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start(() => {
        // Navigate back after animation completes
        router.back();
      });

      // Show success feedback immediately
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

    } catch (error) {
      console.error('Error saving entry:', error);
      setIsSavingEntry(false);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    }
  };

  const styles = createStyles(theme);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <FormHeader title="Create Post" />

          <FormSection title="What's on your mind?">
            <FormInput
              value={postContent}
              onChangeText={setPostContent}
              placeholder="Share your thoughts..."
              multiline
              numberOfLines={8}
              style={styles.textArea}
            />
          </FormSection>

          <FormSection title="Photo">
            <ImageSelector
              images={imageUri ? [imageUri] : []}
              onImagesChange={(images) => {
                const newUri = images[0] || '';
                setImageUri(newUri);
              }}
              maxImages={1}
              title=""
              subtitle="Take a photo or select from gallery"
            />
          </FormSection>

          <FormSection title="Dispensary">
            <FormInput
              value={dispensary}
              onChangeText={setDispensary}
              placeholder="Tag a dispensary (optional)"
            />
          </FormSection>

          <FormSection title="Location">
            <FormInput
              value={location}
              onChangeText={setLocation}
              placeholder="Add location (optional)"
            />
          </FormSection>

          <ActionButton
            title="Share Post"
            icon={Send}
            onPress={handleSave}
            loading={isSavingEntry || isSaving}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
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
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  sectionLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
  inputThird: {
    flex: 1,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  typeChip: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  typeChipActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  typeChipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  typeChipTextActive: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.regular,
  },
  methodGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  methodChip: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  methodChipActive: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  methodChipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  methodChipTextActive: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.regular,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  photoButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.sm,
  },
  removeImage: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.round,
    padding: theme.spacing.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  ratingContainer: {
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.text,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  aiText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  analysisOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  analysisContent: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  analysisText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.background,
    textAlign: 'center',
  },
});