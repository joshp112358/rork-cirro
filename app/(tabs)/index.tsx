import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, TextInput, Modal, FlatList } from 'react-native';
import { Plus, TrendingUp, Calendar, Settings, Heart, MessageCircle, Share, MoreHorizontal, Users, X, Send } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useEntries, useRecentEntries } from '@/hooks/use-entries';
import { EntryCard } from '@/components/EntryCard';

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

export default function HomeScreen() {
  const { theme } = useTheme();
  const { analytics } = useEntries();
  const recentEntries = useRecentEntries(3);
  const [posts, setPosts] = useState(mockPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

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

  const openComments = (post: Post) => {
    setSelectedPost(post);
    setShowComments(true);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.appName}>Cirro</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <Settings size={20} color={theme.colors.textSecondary} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
          <Text style={styles.date}>{today}</Text>
        </View>

        <TouchableOpacity 
          style={styles.newEntryButton}
          onPress={() => router.push('/new-entry')}
          testID="new-entry-button"
        >
          <View style={styles.newEntryContent}>
            <View style={styles.plusIcon}>
              <Plus size={24} color={theme.colors.background} strokeWidth={1.5} />
            </View>
            <View style={styles.newEntryText}>
              <Text style={styles.newEntryTitle}>Log Session</Text>
              <Text style={styles.newEntrySubtitle}>Track your experience</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.budtenderButton}
          onPress={() => router.push('/(tabs)/budtender')}
          testID="budtender-button"
        >
          <View style={styles.newEntryContent}>
            <View style={styles.botIcon}>
              <Text style={styles.botEmoji}>🤖</Text>
            </View>
            <View style={styles.newEntryText}>
              <Text style={styles.newEntryTitle}>AI Budtender</Text>
              <Text style={styles.newEntrySubtitle}>Get personalized recommendations</Text>
            </View>
          </View>
        </TouchableOpacity>

        {analytics && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{analytics.totalSessions}</Text>
              <Text style={styles.statLabel}>Total Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {analytics.avgMoodImprovement > 0 ? '+' : ''}{analytics.avgMoodImprovement.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Avg Mood Change</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{analytics.avgRating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        )}

        {recentEntries.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Sessions</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/journal')}>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            {recentEntries.map(entry => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </View>
        )}



        <View style={styles.communitySection}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={theme.colors.text} strokeWidth={1.5} />
            <Text style={styles.sectionTitle}>Community Posts</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/discover')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {posts.slice(0, 2).map((post) => (
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
          ))}
        </View>
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
    paddingBottom: theme.spacing.xxl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  appName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.heavy,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newEntryButton: {
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
  },
  budtenderButton: {
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
  },
  botIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.cardSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botEmoji: {
    fontSize: 20,
  },
  newEntryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  plusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newEntryText: {
    flex: 1,
  },
  newEntryTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  newEntrySubtitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recentSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  seeAll: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  emptyEmoji: {
    fontSize: 32,
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
  communitySection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  postCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.lg,
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
    height: 250,
    backgroundColor: theme.colors.cardSecondary,
  },
  postContent: {
    padding: theme.spacing.lg,
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
});