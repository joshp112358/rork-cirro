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
          <TouchableOpacity 
            style={[
              styles.postButton,
              { 
                backgroundColor: (title.trim() && content.trim()) ? theme.colors.primary : theme.colors.textTertiary + '40',
                opacity: isSubmitting ? 0.6 : 1
              }
            ]}
            onPress={handleSubmit}
            disabled={!title.trim() || !content.trim() || isSubmitting}
          >
            <Text style={[
              styles.postButtonText,
              { color: (title.trim() && content.trim()) ? theme.colors.background : theme.colors.textTertiary }
            ]}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <TextInput
            style={[
              styles.titleInput,
              {
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
              }
            ]}
            placeholder="What's on your mind?"
            placeholderTextColor={theme.colors.textTertiary}
            value={title}
            onChangeText={setTitle}
            maxLength={200}
            multiline
          />

          {/* Content Input */}
          <TextInput
            style={[
              styles.contentInput,
              {
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
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

          {/* Photos Section */}
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

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={showPhotoOptions}
              disabled={photos.length >= 4}
            >
              <Camera size={20} color={photos.length >= 4 ? theme.colors.textTertiary : theme.colors.primary} />
              <Text style={[
                styles.actionButtonText, 
                { color: photos.length >= 4 ? theme.colors.textTertiary : theme.colors.primary }
              ]}>
                {photos.length > 0 ? `Photos (${photos.length}/4)` : 'Add Photos'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Community Selection */}
          <TouchableOpacity 
            style={[
              styles.communitySelector,
              {
                backgroundColor: selectedCommunityData?.color || theme.colors.primary,
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
            <Text style={[styles.communityName, { color: theme.colors.background }]}>
              {selectedCommunityData?.name || 'General'}
            </Text>
            <ChevronDown size={16} color={theme.colors.background} />
          </TouchableOpacity>

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
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 20,
    paddingHorizontal: 0,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  communitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  communityName: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  photosScroll: {
    marginBottom: 16,
  },
  photosContainer: {
    paddingRight: 20,
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
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
  contentInput: {
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 200,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    paddingBottom: 40,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
  },
});