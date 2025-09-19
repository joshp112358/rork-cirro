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
} from 'react-native';
import {
  X,
  Hash,
  Image as ImageIcon,
  Send,
  Plus,
  Minus,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useCommunities } from '@/hooks/use-communities';
import { router } from 'expo-router';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon: string;
  color: string;
}

const communities: Community[] = [
  {
    id: 'beginners',
    name: 'Beginners',
    description: 'New to cannabis? Start here!',
    memberCount: 12500,
    icon: '🌱',
    color: '#10B981'
  },
  {
    id: 'veterans',
    name: 'Veterans',
    description: 'Experienced users sharing knowledge',
    memberCount: 8900,
    icon: '🏆',
    color: '#F59E0B'
  },
  {
    id: 'seniors',
    name: 'Seniors',
    description: 'Cannabis community for seniors',
    memberCount: 3200,
    icon: '👴',
    color: '#8B5CF6'
  },
  {
    id: 'entrepreneurs',
    name: 'Entrepreneurs',
    description: 'Cannabis business and industry',
    memberCount: 5600,
    icon: '💼',
    color: '#EF4444'
  },
  {
    id: 'medical',
    name: 'Medical',
    description: 'Medical cannabis discussions',
    memberCount: 15800,
    icon: '🏥',
    color: '#06B6D4'
  },
  {
    id: 'growers',
    name: 'Growers',
    description: 'Growing tips and techniques',
    memberCount: 7300,
    icon: '🌿',
    color: '#84CC16'
  },
  {
    id: 'edibles',
    name: 'Edibles',
    description: 'Cooking and baking with cannabis',
    memberCount: 9100,
    icon: '🍪',
    color: '#F97316'
  },
  {
    id: 'local',
    name: 'Local',
    description: 'Local dispensaries and events',
    memberCount: 4500,
    icon: '📍',
    color: '#EC4899'
  },
  {
    id: 'reviews',
    name: 'Reviews',
    description: 'Product and strain reviews',
    memberCount: 11200,
    icon: '⭐',
    color: '#6366F1'
  },
  {
    id: 'general',
    name: 'General',
    description: 'General cannabis discussions',
    memberCount: 18700,
    icon: '💬',
    color: '#64748B'
  }
];

const popularTags = [
  'beginner', 'advice', 'review', 'question', 'help',
  'recommendation', 'experience', 'tips', 'discussion',
  'cbd', 'thc', 'indica', 'sativa', 'hybrid'
];

export default function CreatePostScreen() {
  const { theme } = useTheme();
  const { joinedCommunities, isJoined } = useCommunities();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Filter communities to only show joined ones
  const joinedCommunitiesData = communities.filter(community => isJoined(community.id));

  const addTag = (tag: string) => {
    const cleanTag = tag.toLowerCase().trim();
    if (cleanTag && !tags.includes(cleanTag) && tags.length < 10) {
      setTags([...tags, cleanTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag);
      setCustomTag('');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Information', 'Please fill in both title and content.');
      return;
    }
    
    if (!selectedCommunity) {
      Alert.alert('Select Community', 'Please select a community to post in.');
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
        tags: tags,
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

  const selectedCommunityData = communities.find(comm => comm.id === selectedCommunity);
  
  // Show message if user hasn't joined any communities
  if (joinedCommunitiesData.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Create Post</Text>
          <View style={{ width: 36 }} />
        </View>
        
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>Join a Community First</Text>
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            You need to join at least one community before you can create posts. Go to the Explore tab and long press on communities to join them.
          </Text>
          <TouchableOpacity 
            style={[styles.exploreButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              router.back();
              router.push('/(tabs)/explore');
            }}
          >
            <Text style={[styles.exploreButtonText, { color: theme.colors.background }]}>Explore Communities</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
                backgroundColor: (title.trim() && content.trim() && selectedCommunity) ? theme.colors.primary : theme.colors.textTertiary + '30'
              }
            ]}
            onPress={handleSubmit}
            disabled={!title.trim() || !content.trim() || !selectedCommunity || isSubmitting}
          >
            <Send 
              size={18} 
              color={(title.trim() && content.trim() && selectedCommunity) ? theme.colors.background : theme.colors.textTertiary} 
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
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>Choose which community to post in</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {joinedCommunitiesData.map((community) => {
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
                    <Text style={styles.communityIcon}>{community.icon}</Text>
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
                  </TouchableOpacity>
                );
              })}
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

          {/* Tags Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Tags</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textTertiary }]}>
              Add up to 10 tags to help others find your post
            </Text>
            
            {/* Selected Tags */}
            {tags.length > 0 && (
              <View style={styles.selectedTags}>
                {tags.map((tag) => (
                  <View key={tag} style={[styles.selectedTag, { backgroundColor: theme.colors.primary + '15' }]}>
                    <Hash size={12} color={theme.colors.primary} />
                    <Text style={[styles.selectedTagText, { color: theme.colors.primary }]}>
                      {tag}
                    </Text>
                    <TouchableOpacity onPress={() => removeTag(tag)}>
                      <Minus size={14} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Custom Tag Input */}
            <View style={styles.customTagContainer}>
              <TextInput
                style={[
                  styles.customTagInput,
                  {
                    color: theme.colors.text,
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  }
                ]}
                placeholder="Add custom tag..."
                placeholderTextColor={theme.colors.textTertiary}
                value={customTag}
                onChangeText={setCustomTag}
                maxLength={20}
                onSubmitEditing={addCustomTag}
              />
              <TouchableOpacity 
                style={[
                  styles.addTagButton,
                  { backgroundColor: customTag.trim() ? theme.colors.primary : theme.colors.textTertiary + '30' }
                ]}
                onPress={addCustomTag}
                disabled={!customTag.trim() || tags.length >= 10}
              >
                <Plus 
                  size={16} 
                  color={customTag.trim() ? theme.colors.background : theme.colors.textTertiary} 
                />
              </TouchableOpacity>
            </View>

            {/* Popular Tags */}
            <Text style={[styles.popularTagsTitle, { color: theme.colors.textSecondary }]}>Popular Tags:</Text>
            <View style={styles.popularTags}>
              {popularTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.popularTag,
                    {
                      backgroundColor: tags.includes(tag) ? theme.colors.primary + '15' : theme.colors.backgroundSecondary,
                      borderColor: tags.includes(tag) ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                  onPress={() => addTag(tag)}
                  disabled={tags.includes(tag) || tags.length >= 10}
                >
                  <Hash size={10} color={tags.includes(tag) ? theme.colors.primary : theme.colors.textTertiary} />
                  <Text
                    style={[
                      styles.popularTagText,
                      {
                        color: tags.includes(tag) ? theme.colors.primary : theme.colors.textTertiary,
                      }
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  categoriesContainer: {
    paddingRight: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  communityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 8,
    minWidth: 100,
  },
  communityIcon: {
    fontSize: 16,
  },
  communityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  exploreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  selectedTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  customTagContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  customTagInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  addTagButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularTagsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  popularTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    gap: 3,
  },
  popularTagText: {
    fontSize: 11,
    fontWeight: '500',
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
});