import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, TextInput, Modal, FlatList, Alert } from 'react-native';
import { Heart, MessageCircle, Share, MoreHorizontal, Users, TrendingUp, BookOpen, Clock, X, Send, Plus, Camera, Type } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  readTime: string;
  category: 'Education' | 'News' | 'Research' | 'Culture';
  timestamp: string;
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  strain: {
    name: string;
    type: 'Indica' | 'Sativa' | 'Hybrid' | 'CBD';
  };
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  liked: boolean;
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Science Behind Terpenes: How They Affect Your High',
    excerpt: 'Understanding the role of terpenes in cannabis and how they interact with cannabinoids to create unique effects.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=200&fit=crop',
    author: 'Dr. Sarah Johnson',
    readTime: '5 min read',
    category: 'Education',
    timestamp: '2 days ago',
  },
  {
    id: '2',
    title: 'Cannabis Legalization Update: What Changed This Month',
    excerpt: 'Latest developments in cannabis legislation across different states and their impact on the industry.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
    author: 'Mike Chen',
    readTime: '3 min read',
    category: 'News',
    timestamp: '1 week ago',
  },
  {
    id: '3',
    title: 'Growing at Home: Essential Tips for Beginners',
    excerpt: 'Everything you need to know to start your first cannabis garden, from seeds to harvest.',
    image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=200&fit=crop',
    author: 'Green Thumb Collective',
    readTime: '8 min read',
    category: 'Education',
    timestamp: '3 days ago',
  },
];

const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    strain: {
      name: 'Purple Haze',
      type: 'Sativa',
    },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    caption: 'Perfect for a creative afternoon session. The colors are incredible!',
    likes: 127,
    comments: [
      {
        id: '1',
        user: {
          name: 'Alex R.',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        },
        text: 'Totally agree! Purple Haze is amazing for creativity.',
        timestamp: '1h',
        likes: 5,
        liked: false,
      },
      {
        id: '2',
        user: {
          name: 'Emma K.',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        },
        text: 'Where did you get this strain? Looks fire!',
        timestamp: '45m',
        likes: 2,
        liked: true,
      },
    ],
    timestamp: '2h',
    liked: false,
  },
  {
    id: '2',
    user: {
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: false,
    },
    strain: {
      name: 'Northern Lights',
      type: 'Indica',
    },
    image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&h=400&fit=crop',
    caption: 'Best sleep strain I\'ve tried. Knocked me out in the best way possible',
    likes: 89,
    comments: [
      {
        id: '3',
        user: {
          name: 'Jake M.',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        },
        text: 'Northern Lights is a classic! Perfect for insomnia.',
        timestamp: '2h',
        likes: 8,
        liked: false,
      },
    ],
    timestamp: '4h',
    liked: true,
  },
  {
    id: '3',
    user: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    strain: {
      name: 'Blue Dream',
      type: 'Hybrid',
    },
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
    caption: 'The perfect balance. Great for both day and night sessions. Highly recommend!',
    likes: 203,
    comments: [
      {
        id: '4',
        user: {
          name: 'Lisa T.',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        },
        text: 'Blue Dream never disappoints! My go-to strain.',
        timestamp: '3h',
        likes: 12,
        liked: true,
      },
      {
        id: '5',
        user: {
          name: 'Tom W.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        },
        text: 'What dispensary? Been looking for good Blue Dream.',
        timestamp: '2h',
        likes: 3,
        liked: false,
      },
    ],
    timestamp: '6h',
    liked: false,
  },
];

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState(mockPosts);
  const [activeTab, setActiveTab] = useState<'trending' | 'following'>('trending');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostStrain, setNewPostStrain] = useState<{ name: string; type: 'Indica' | 'Sativa' | 'Hybrid' | 'CBD' }>({ name: '', type: 'Hybrid' });
  const [newPostImage, setNewPostImage] = useState('');

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleCommentLike = (postId: string, commentId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map(comment =>
                comment.id === commentId
                  ? {
                      ...comment,
                      liked: !comment.liked,
                      likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                    }
                  : comment
              ),
            }
          : post
      )
    );
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedPost) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      },
      text: commentText.trim(),
      timestamp: 'now',
      likes: 0,
      liked: false,
    };

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === selectedPost.id
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post
      )
    );

    setCommentText('');
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) {
      Alert.alert('Error', 'Please write something for your post');
      return;
    }

    if (!newPostStrain.name.trim()) {
      Alert.alert('Error', 'Please enter a strain name');
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        verified: false,
      },
      strain: {
        name: newPostStrain.name.trim(),
        type: newPostStrain.type,
      },
      image: newPostImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      caption: newPostText.trim(),
      likes: 0,
      comments: [],
      timestamp: 'now',
      liked: false,
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setNewPostText('');
    setNewPostStrain({ name: '', type: 'Hybrid' });
    setNewPostImage('');
    setShowCreatePost(false);
  };

  const handleAddPhoto = () => {
    Alert.alert(
      'Add Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openComments = (post: Post) => {
    setSelectedPost(post);
    setShowComments(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Education':
        return '#10B981';
      case 'News':
        return '#3B82F6';
      case 'Research':
        return '#8B5CF6';
      case 'Culture':
        return '#F59E0B';
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStrainTypeColor = (type: string) => {
    switch (type) {
      case 'Indica':
        return '#8B5CF6';
      case 'Sativa':
        return '#10B981';
      case 'Hybrid':
        return '#F59E0B';
      case 'CBD':
        return '#06B6D4';
      default:
        return theme.colors.textSecondary;
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Discover</Text>
          <TouchableOpacity 
            style={styles.createPostButton}
            onPress={() => setShowCreatePost(true)}
          >
            <Plus size={20} color={theme.colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
            onPress={() => setActiveTab('trending')}
          >
            <TrendingUp size={16} color={activeTab === 'trending' ? theme.colors.primary : theme.colors.textSecondary} strokeWidth={1.5} />
            <Text style={[
              styles.tabText,
              activeTab === 'trending' && styles.activeTabText
            ]}>
              Trending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'following' && styles.activeTab]}
            onPress={() => setActiveTab('following')}
          >
            <Users size={16} color={activeTab === 'following' ? theme.colors.primary : theme.colors.textSecondary} strokeWidth={1.5} />
            <Text style={[
              styles.tabText,
              activeTab === 'following' && styles.activeTabText
            ]}>
              Following
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'trending' && (
          <View style={styles.articlesSection}>
            <View style={styles.sectionHeader}>
              <BookOpen size={20} color={theme.colors.text} strokeWidth={1.5} />
              <Text style={styles.sectionTitle}>Featured Articles</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.articlesScroll}
              contentContainerStyle={styles.articlesContent}
            >
              {mockArticles.map((article) => (
                <TouchableOpacity key={article.id} style={styles.articleCard}>
                  <Image source={{ uri: article.image }} style={styles.articleImage} />
                  <View style={styles.articleContent}>
                    <View style={styles.articleMeta}>
                      <View style={[
                        styles.categoryBadge,
                        { backgroundColor: getCategoryColor(article.category) }
                      ]}>
                        <Text style={styles.categoryText}>{article.category}</Text>
                      </View>
                      <Text style={styles.readTime}>{article.readTime}</Text>
                    </View>
                    <Text style={styles.articleTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                    <Text style={styles.articleExcerpt} numberOfLines={2}>
                      {article.excerpt}
                    </Text>
                    <View style={styles.articleFooter}>
                      <Text style={styles.articleAuthor}>{article.author}</Text>
                      <Text style={styles.articleTimestamp}>{article.timestamp}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.postsSection}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={theme.colors.text} strokeWidth={1.5} />
            <Text style={styles.sectionTitle}>Community Posts</Text>
          </View>
        </View>

        {activeTab === 'following' && posts.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Users size={32} color={theme.colors.textSecondary} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>
              Follow other users to see their posts here
            </Text>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                  <View style={styles.userDetails}>
                    <View style={styles.userNameRow}>
                      <Text style={styles.userName}>{post.user.name}</Text>
                      {post.user.verified && (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.strainInfo}>
                      <View style={[
                        styles.strainTypeBadge,
                        { backgroundColor: getStrainTypeColor(post.strain.type) }
                      ]}>
                        <Text style={styles.strainTypeText}>{post.strain.type}</Text>
                      </View>
                      <Text style={styles.strainName}>{post.strain.name}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.postMeta}>
                  <Text style={styles.timestamp}>{post.timestamp}</Text>
                  <TouchableOpacity style={styles.moreButton}>
                    <MoreHorizontal size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />
                  </TouchableOpacity>
                </View>
              </View>

              <Image source={{ uri: post.image }} style={styles.postImage} />

              <View style={styles.postContent}>
                <Text style={styles.caption}>{post.caption}</Text>
                
                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleLike(post.id)}
                  >
                    <Heart 
                      size={20} 
                      color={post.liked ? '#EF4444' : theme.colors.textSecondary}
                      fill={post.liked ? '#EF4444' : 'none'}
                      strokeWidth={1.5}
                    />
                    <Text style={[
                      styles.actionText,
                      post.liked && { color: '#EF4444' }
                    ]}>
                      {post.likes}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => openComments(post)}
                  >
                    <MessageCircle size={20} color={theme.colors.textSecondary} strokeWidth={1.5} />
                    <Text style={styles.actionText}>{post.comments.length}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Share size={20} color={theme.colors.textSecondary} strokeWidth={1.5} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showComments}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comments</Text>
            <TouchableOpacity 
              onPress={() => setShowComments(false)}
              style={styles.closeButton}
            >
              <X size={24} color={theme.colors.text} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          {selectedPost && (
            <>
              <FlatList
                data={selectedPost.comments}
                keyExtractor={(item) => item.id}
                style={styles.commentsList}
                renderItem={({ item: comment }) => (
                  <View style={styles.commentItem}>
                    <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentUserName}>{comment.user.name}</Text>
                        <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
                      </View>
                      <Text style={styles.commentText}>{comment.text}</Text>
                      <TouchableOpacity 
                        style={styles.commentLikeButton}
                        onPress={() => handleCommentLike(selectedPost.id, comment.id)}
                      >
                        <Heart 
                          size={16} 
                          color={comment.liked ? '#EF4444' : theme.colors.textSecondary}
                          fill={comment.liked ? '#EF4444' : 'none'}
                          strokeWidth={1.5}
                        />
                        <Text style={[
                          styles.commentLikeText,
                          comment.liked && { color: '#EF4444' }
                        ]}>
                          {comment.likes}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyComments}>
                    <MessageCircle size={32} color={theme.colors.textSecondary} strokeWidth={1.5} />
                    <Text style={styles.emptyCommentsText}>No comments yet</Text>
                    <Text style={styles.emptyCommentsSubtext}>Be the first to comment!</Text>
                  </View>
                }
              />

              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    { opacity: commentText.trim() ? 1 : 0.5 }
                  ]}
                  onPress={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  <Send size={20} color={theme.colors.primary} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showCreatePost}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowCreatePost(false)}
              style={styles.closeButton}
            >
              <X size={24} color={theme.colors.text} strokeWidth={1.5} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity 
              style={[
                styles.postButton,
                { opacity: newPostText.trim() && newPostStrain.name.trim() ? 1 : 0.5 }
              ]}
              onPress={handleCreatePost}
              disabled={!newPostText.trim() || !newPostStrain.name.trim()}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.createPostContent}>
            <View style={styles.createPostSection}>
              <Text style={styles.sectionLabel}>What's on your mind?</Text>
              <TextInput
                style={styles.postTextInput}
                placeholder="Share your cannabis experience..."
                placeholderTextColor={theme.colors.textSecondary}
                value={newPostText}
                onChangeText={setNewPostText}
                multiline
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>
                {newPostText.length}/500
              </Text>
            </View>

            <View style={styles.createPostSection}>
              <Text style={styles.sectionLabel}>Strain Information</Text>
              <View style={styles.strainInputContainer}>
                <TextInput
                  style={styles.strainNameInput}
                  placeholder="Strain name (e.g., Blue Dream)"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newPostStrain.name}
                  onChangeText={(text) => setNewPostStrain(prev => ({ ...prev, name: text }))}
                  maxLength={50}
                />
                <View style={styles.strainTypeContainer}>
                  {(['Indica', 'Sativa', 'Hybrid', 'CBD'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.strainTypeOption,
                        newPostStrain.type === type && styles.strainTypeSelected,
                        { backgroundColor: newPostStrain.type === type ? getStrainTypeColor(type) : theme.colors.cardSecondary }
                      ]}
                      onPress={() => setNewPostStrain(prev => ({ ...prev, type }))}
                    >
                      <Text style={[
                        styles.strainTypeOptionText,
                        { color: newPostStrain.type === type ? '#FFFFFF' : theme.colors.text }
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.createPostSection}>
              <Text style={styles.sectionLabel}>Add Photo (Optional)</Text>
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <Camera size={24} color={theme.colors.textSecondary} strokeWidth={1.5} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
              {newPostImage && (
                <View style={styles.selectedImageContainer}>
                  <Image source={{ uri: newPostImage }} style={styles.selectedImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setNewPostImage('')}
                  >
                    <X size={16} color={theme.colors.background} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.heavy,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  createPostButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.card,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  activeTab: {
    backgroundColor: theme.colors.cardSecondary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  postsContainer: {
    flex: 1,
  },
  postCard: {
    backgroundColor: theme.colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.lg,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 10,
    color: theme.colors.background,
    fontWeight: theme.fontWeight.heavy,
  },
  strainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  strainTypeBadge: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  strainTypeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  strainName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  postMeta: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  timestamp: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moreButton: {
    padding: theme.spacing.xs,
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.cardSecondary,
  },
  postContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  caption: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.md,
    marginBottom: theme.spacing.lg,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.sm,
    maxWidth: 280,
  },
  articlesSection: {
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  articlesScroll: {
    paddingLeft: theme.spacing.xl,
  },
  articlesContent: {
    paddingRight: theme.spacing.xl,
  },
  articleCard: {
    width: 280,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 140,
    backgroundColor: theme.colors.cardSecondary,
  },
  articleContent: {
    padding: theme.spacing.lg,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  readTime: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  articleTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    lineHeight: theme.lineHeight.tight * theme.fontSize.md,
    marginBottom: theme.spacing.sm,
  },
  articleExcerpt: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.sm,
    marginBottom: theme.spacing.md,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleAuthor: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  articleTimestamp: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  postsSection: {
    paddingTop: theme.spacing.lg,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.sm,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  commentUserName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  commentTimestamp: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  commentText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.sm,
    marginBottom: theme.spacing.sm,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  commentLikeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  emptyComments: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyCommentsText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyCommentsSubtext: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  commentInput: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    backgroundColor: theme.colors.cardSecondary,
    maxHeight: 100,
  },
  sendButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.cardSecondary,
  },
  postButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.primary,
  },
  postButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.background,
  },
  createPostContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  createPostSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  postTextInput: {
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    backgroundColor: theme.colors.cardSecondary,
    minHeight: 120,
    marginBottom: theme.spacing.xs,
  },
  characterCount: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  strainInputContainer: {
    gap: theme.spacing.md,
  },
  strainNameInput: {
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    backgroundColor: theme.colors.cardSecondary,
  },
  strainTypeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  strainTypeOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  strainTypeSelected: {
    borderColor: 'transparent',
  },
  strainTypeOptionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.cardSecondary,
  },
  addPhotoText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  selectedImageContainer: {
    position: 'relative',
    marginTop: theme.spacing.md,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.cardSecondary,
  },
  removeImageButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});