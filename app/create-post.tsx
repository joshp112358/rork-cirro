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
  Send,
  Camera,
  Trash2,
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
    } catch (error) {
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Create Post</Text>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              { 
                backgroundColor: (title.trim() && content.trim()) ? theme.colors.primary : theme.colors.textTertiary + '30'
              }
            ]}
            onPress={handleSubmit}
            disabled={!title.trim() || !content.trim() || isSubmitting}
          >
            <Send 
              size={18} 
              color={(title.trim() && content.trim()) ? theme.colors.background : theme.colors.textTertiary} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Title</Text>
            <TextInput
              style={[
                styles.titleInput,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }
              ]}
              placeholder="What's on your mind?"
              placeholderTextColor={theme.colors.textTertiary}
              value={title}
              onChangeText={setTitle}
              maxLength={200}
              multiline
            />
            <Text style={[styles.characterCount, { color: theme.colors.textTertiary }]}>
              {title.length}/200
            </Text>
          </View>

          {/* Community Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Community</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>
              Choose the community that best fits your post
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.communitiesContainer}
            >
              {communities.map((community) => {
                const isSelected = selectedCommunity === community.id;
                return (
                  <TouchableOpacity
                    key={community.id}
                    style={[
                      styles.communityChip,
                      {
                        backgroundColor: isSelected ? community.color : theme.colors.card,
                        borderColor: isSelected ? community.color : theme.colors.border,
                      }
                    ]}
                    onPress={() => setSelectedCommunity(community.id)}
                  >
                    <Text
                      style={[
                        styles.communityText,
                        {
                          color: isSelected ? theme.colors.background : theme.colors.text,
                        }
                      ]}
                    >
                      {community.name}
                    </Text>
                    {isSelected && (
                      <Text
                        style={[
                          styles.communityDescription,
                          { color: theme.colors.background + 'CC' }
                        ]}
                      >
                        {community.description}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Photos Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Photos</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>
              Add up to 4 photos to your post
            </Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosContainer}
            >
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={[styles.removePhotoButton, { backgroundColor: theme.colors.background }]}
                    onPress={() => removePhoto(index)}
                  >
                    <Trash2 size={16} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {photos.length < 4 && (
                <TouchableOpacity
                  style={[
                    styles.addPhotoButton,
                    {
                      backgroundColor: theme.colors.card,
                      borderColor: theme.colors.border,
                    }
                  ]}
                  onPress={showPhotoOptions}
                >
                  <Camera size={24} color={theme.colors.textTertiary} />
                  <Text style={[styles.addPhotoText, { color: theme.colors.textTertiary }]}>
                    Add Photo
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* Content Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Content</Text>
            <TextInput
              style={[
                styles.contentInput,
                {
                  color: theme.colors.text,
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
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
            <Text style={[styles.characterCount, { color: theme.colors.textTertiary }]}>
              {content.length}/2000
            </Text>
          </View>



          {/* Guidelines */}
          <View style={[styles.guidelines, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.guidelinesTitle, { color: theme.colors.text }]}>Community Guidelines</Text>
            <Text style={[styles.guidelinesText, { color: theme.colors.textSecondary }]}>
              • Be respectful and constructive{"\n"}
              • Stay on topic and relevant{"\n"}
              • No spam or self-promotion{"\n"}
              • Follow local laws and regulations
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  submitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
    minHeight: 50,
    textAlignVertical: 'top',
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  communitiesContainer: {
    paddingRight: 20,
    gap: 12,
  },
  communityChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 120,
  },
  communityText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  communityDescription: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '400',
  },
  guidelines: {
    marginTop: 24,
    marginBottom: 40,
    padding: 16,
    borderRadius: 12,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 13,
    lineHeight: 18,
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
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});