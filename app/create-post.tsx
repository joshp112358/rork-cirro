import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import {
  X,
  Camera,
  Trash2,
  ChevronDown,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/use-theme';
import { router } from 'expo-router';

interface Community {
  id: string;
  name: string;
  color: string;
  description: string;
}

const communities: Community[] = [
  { id: 'general', name: 'General', color: '#6B7280', description: 'General discussions' },
  { id: 'beginners', name: 'Beginners', color: '#10B981', description: 'New to cannabis? Start here!' },
  { id: 'veterans', name: 'Veterans', color: '#DC2626', description: 'For military veterans' },
  { id: 'seniors', name: 'Seniors', color: '#8B5CF6', description: 'Cannabis for older adults' },
  { id: 'entrepreneurs', name: 'Entrepreneurs', color: '#F59E0B', description: 'Cannabis business discussions' },
  { id: 'gamers', name: 'Gamers', color: '#2563EB', description: 'Gaming and cannabis community' },
  { id: 'students', name: 'Students', color: '#059669', description: 'College and university students' },
  { id: 'medical', name: 'Medical', color: '#7C3AED', description: 'Medical cannabis patients' },
];

export default function CreatePostScreen() {
  const { theme } = useTheme();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('general');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Information', 'Please fill in both title and content.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send this data to your backend
      const newPost = {
        title: title.trim(),
        content: content.trim(),
        community: selectedCommunity,
        photos: photos,
        timestamp: new Date().toISOString(),
      };
      
      console.log('Creating post:', newPost);
      
      Alert.alert(
        'Post Created!', 
        'Your post has been published successfully.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to add photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const selectedCommunityData = communities.find(c => c.id === selectedCommunity);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Create Post</Text>
          <TouchableOpacity 
            style={[
              styles.postButton,
              { 
                backgroundColor: (title.trim() && content.trim()) ? theme.colors.primary : theme.colors.card,
                borderColor: (title.trim() && content.trim()) ? theme.colors.primary : theme.colors.border,
                opacity: isSubmitting ? 0.6 : 1
              }
            ]}
            onPress={handleSubmit}
            disabled={!title.trim() || !content.trim() || isSubmitting}
          >
            <Text style={[
              styles.postButtonText,
              { color: (title.trim() && content.trim()) ? theme.colors.background : theme.colors.textSecondary }
            ]}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Title</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <TextInput
                style={[
                  styles.titleInput,
                  {
                    color: theme.colors.text,
                  }
                ]}
                placeholder="What's on your mind?"
                placeholderTextColor={theme.colors.textTertiary}
                value={title}
                onChangeText={setTitle}
                maxLength={200}
                multiline
              />
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Content</Text>
            <View style={[styles.inputContainer, styles.contentContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <TextInput
                style={[
                  styles.contentInput,
                  {
                    color: theme.colors.text,
                  }
                ]}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                placeholderTextColor={theme.colors.textTertiary}
                value={content}
                onChangeText={setContent}
                maxLength={2000}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Photos Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Photos</Text>
            
            {photos.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photosContainer}
                style={styles.photosScroll}
              >
                {photos.map((photo, index) => (
                  <View key={`photo-${index}-${photo.slice(-10)}`} style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <TouchableOpacity
                      style={[styles.removePhotoButton, { backgroundColor: theme.colors.background }]}
                      onPress={() => removePhoto(index)}
                    >
                      <Trash2 size={14} color={theme.colors.text} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={[
                styles.addPhotoButton,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={showPhotoOptions}
              disabled={photos.length >= 4}
            >
              <Camera size={20} color={photos.length >= 4 ? theme.colors.textTertiary : theme.colors.textSecondary} />
              <Text style={[
                styles.addPhotoText, 
                { color: photos.length >= 4 ? theme.colors.textTertiary : theme.colors.textSecondary }
              ]}>
                {photos.length > 0 ? `Add More (${photos.length}/4)` : 'Add Photos'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Community Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Community</Text>
            <TouchableOpacity 
              style={[
                styles.communitySelector,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => {
                Alert.alert(
                  'Select Community',
                  'Choose the community for your post',
                  communities.map(community => ({
                    text: community.name,
                    onPress: () => setSelectedCommunity(community.id)
                  }))
                );
              }}
            >
              <View style={styles.communityInfo}>
                <View style={[
                  styles.communityDot,
                  { backgroundColor: selectedCommunityData?.color || theme.colors.primary }
                ]} />
                <Text style={[styles.communityName, { color: theme.colors.text }]}>
                  {selectedCommunityData?.name || 'General'}
                </Text>
              </View>
              <ChevronDown size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Character Count */}
          <View style={styles.footer}>
            <Text style={[styles.characterCount, { color: theme.colors.textTertiary }]}>
              {content.length}/2000 characters
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 4,
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 1,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contentContainer: {
    minHeight: 120,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: '500',
    minHeight: 24,
    textAlignVertical: 'top',
  },
  contentInput: {
    fontSize: 16,
    minHeight: 96,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  photosScroll: {
    marginBottom: 12,
  },
  photosContainer: {
    paddingRight: 20,
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  communitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  communityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  communityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  communityName: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    paddingBottom: 40,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
});