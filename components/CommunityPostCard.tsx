import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

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
  strain?: {
    name: string;
    type: 'Indica' | 'Sativa' | 'Hybrid' | 'CBD';
  };
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  liked: boolean;
  dispensary?: string;
  location?: string;
}

interface CommunityPostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onCommentLike: (postId: string, commentId: string) => void;
}

export function CommunityPostCard({ post, onLike, onComment, onCommentLike }: CommunityPostCardProps) {
  const { theme } = useTheme();
  const [commentText, setCommentText] = useState<string>('');

  const handleAddComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText.trim());
      setCommentText('');
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
    <View style={styles.postCard}>
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
            {post.strain && (
              <View style={styles.strainInfo}>
                <View style={[
                  styles.strainTypeBadge,
                  { backgroundColor: getStrainTypeColor(post.strain.type) }
                ]}>
                  <Text style={styles.strainTypeText}>{post.strain.type}</Text>
                </View>
                <Text style={styles.strainName}>{post.strain.name}</Text>
              </View>
            )}
            {(post.dispensary || post.location) && (
              <View style={styles.postMetaInfo}>
                {post.dispensary && (
                  <Text style={styles.postMetaText}>📍 {post.dispensary}</Text>
                )}
                {post.location && (
                  <Text style={styles.postMetaText}>🌍 {post.location}</Text>
                )}
              </View>
            )}
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
            onPress={() => onLike(post.id)}
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
          
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color={theme.colors.textSecondary} strokeWidth={1.5} />
            <Text style={styles.actionText}>{post.comments.length}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Comment Section */}
        <View style={styles.quickCommentSection}>
          <View style={styles.quickCommentInputContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face' }} 
              style={styles.quickCommentAvatar} 
            />
            <TextInput
              style={styles.quickCommentInput}
              placeholder="Add a comment..."
              placeholderTextColor={theme.colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              onSubmitEditing={handleAddComment}
              returnKeyType="send"
              multiline={false}
            />
            {commentText.trim() ? (
              <TouchableOpacity 
                style={styles.quickSendButton}
                onPress={handleAddComment}
              >
                <Send size={16} color={theme.colors.primary} strokeWidth={1.5} />
              </TouchableOpacity>
            ) : null}
          </View>
          
          {/* Show recent comments */}
          {post.comments.length > 0 && (
            <View style={styles.recentCommentsContainer}>
              {post.comments.slice(-2).map((comment) => (
                <View key={comment.id} style={styles.recentCommentItem}>
                  <Image source={{ uri: comment.user.avatar }} style={styles.recentCommentAvatar} />
                  <View style={styles.recentCommentContent}>
                    <Text style={styles.recentCommentText}>
                      <Text style={styles.recentCommentUserName}>{comment.user.name}</Text>
                      {' '}{comment.text}
                    </Text>
                    <View style={styles.recentCommentMeta}>
                      <Text style={styles.recentCommentTimestamp}>{comment.timestamp}</Text>
                      <TouchableOpacity 
                        style={styles.recentCommentLikeButton}
                        onPress={() => onCommentLike(post.id, comment.id)}
                      >
                        <Heart 
                          size={12} 
                          color={comment.liked ? '#EF4444' : theme.colors.textSecondary}
                          fill={comment.liked ? '#EF4444' : 'none'}
                          strokeWidth={1.5}
                        />
                        <Text style={[
                          styles.recentCommentLikeText,
                          comment.liked && { color: '#EF4444' }
                        ]}>
                          {comment.likes}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              {post.comments.length > 2 && (
                <TouchableOpacity style={styles.viewAllCommentsButton}>
                  <Text style={styles.viewAllCommentsText}>
                    View all {post.comments.length} comments
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
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
  quickCommentSection: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
  },
  quickCommentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  quickCommentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  quickCommentInput: {
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
    maxHeight: 80,
  },
  quickSendButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.cardSecondary,
  },
  recentCommentsContainer: {
    gap: theme.spacing.sm,
  },
  recentCommentItem: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  recentCommentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  recentCommentContent: {
    flex: 1,
  },
  recentCommentText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.sm,
    marginBottom: theme.spacing.xs,
  },
  recentCommentUserName: {
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  recentCommentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  recentCommentTimestamp: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  recentCommentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  recentCommentLikeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  viewAllCommentsButton: {
    paddingVertical: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  viewAllCommentsText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  postMetaInfo: {
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  postMetaText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
});