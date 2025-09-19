import React, { useState, useEffect } from 'react';
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
  Image,
} from 'react-native';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share,
  Bookmark,
  Award,
  Hash,
  Send,
  MoreHorizontal,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { router, useLocalSearchParams } from 'expo-router';

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  replies?: Comment[];
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  category: string;
  isPinned?: boolean;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  isBookmarked?: boolean;
  image?: string;
  awards?: number;
  tags: string[];
}

// Mock data - in a real app this would come from your backend
const mockPost: ForumPost = {
  id: '1',
  title: 'Best strains for anxiety relief?',
  content: `Looking for recommendations on strains that help with anxiety without making me too sleepy. I've been dealing with anxiety for a while now and traditional medications haven't been working well for me.

I've tried a few different strains but haven't found the perfect match yet. Some make me too drowsy during the day, while others don't seem to help much with the anxiety itself.

What has worked best for you? Any specific terpene profiles I should look for? I'm particularly interested in:

• Strains that provide calm without sedation
• Good for daytime use
• Minimal paranoia or racing thoughts
• Available in most dispensaries

Thanks in advance for any advice!`,
  author: 'GreenThumb420',
  timestamp: '2h ago',
  upvotes: 124,
  downvotes: 5,
  comments: [
    {
      id: 'c1',
      content: 'I recommend Blue Dream or Northern Lights. Both are great for anxiety without being too sedating. Blue Dream especially is perfect for daytime use.',
      author: 'MedicalUser',
      timestamp: '1h ago',
      upvotes: 12,
      downvotes: 0,
      replies: [
        {
          id: 'c1r1',
          content: 'Second this! Blue Dream has been a game changer for my anxiety.',
          author: 'AnxietyFree',
          timestamp: '45m ago',
          upvotes: 5,
          downvotes: 0,
        }
      ]
    },
    {
      id: 'c2',
      content: 'CBD dominant strains like Charlotte\'s Web work wonders for me! The high CBD to THC ratio really helps with anxiety without the psychoactive effects.',
      author: 'AnxietyFree',
      timestamp: '45m ago',
      upvotes: 8,
      downvotes: 1,
    },
    {
      id: 'c3',
      content: 'Look for strains high in linalool and myrcene terpenes. These are known for their calming effects. Lavender and Granddaddy Purple are good options.',
      author: 'TerpeneExpert',
      timestamp: '30m ago',
      upvotes: 15,
      downvotes: 0,
    },
  ],
  category: 'Medical',
  isPinned: true,
  awards: 2,
  tags: ['anxiety', 'medical', 'strains', 'cbd', 'recommendations'],
};

export default function ThreadDetailScreen() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<ForumPost>(mockPost);
  const [newComment, setNewComment] = useState<string>('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleVote = (type: 'up' | 'down', commentId?: string) => {
    if (commentId) {
      // Handle comment voting
      setPost(prev => ({
        ...prev,
        comments: prev.comments.map(comment => {
          if (comment.id === commentId) {
            if (type === 'up') {
              return {
                ...comment,
                isUpvoted: !comment.isUpvoted,
                isDownvoted: false,
                upvotes: comment.isUpvoted ? comment.upvotes - 1 : comment.upvotes + 1,
                downvotes: comment.isDownvoted ? comment.downvotes - 1 : comment.downvotes,
              };
            } else {
              return {
                ...comment,
                isDownvoted: !comment.isDownvoted,
                isUpvoted: false,
                downvotes: comment.isDownvoted ? comment.downvotes - 1 : comment.downvotes + 1,
                upvotes: comment.isUpvoted ? comment.upvotes - 1 : comment.upvotes,
              };
            }
          }
          return comment;
        })
      }));
    } else {
      // Handle post voting
      setPost(prev => {
        if (type === 'up') {
          return {
            ...prev,
            isUpvoted: !prev.isUpvoted,
            isDownvoted: false,
            upvotes: prev.isUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
            downvotes: prev.isDownvoted ? prev.downvotes - 1 : prev.downvotes,
          };
        } else {
          return {
            ...prev,
            isDownvoted: !prev.isDownvoted,
            isUpvoted: false,
            downvotes: prev.isDownvoted ? prev.downvotes - 1 : prev.downvotes + 1,
            upvotes: prev.isUpvoted ? prev.upvotes - 1 : prev.upvotes,
          };
        }
      });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      content: newComment.trim(),
      author: 'You',
      timestamp: 'now',
      upvotes: 0,
      downvotes: 0,
    };

    setPost(prev => ({
      ...prev,
      comments: [...prev.comments, comment]
    }));

    setNewComment('');
    setReplyingTo(null);
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <View key={comment.id} style={[
      styles.commentContainer,
      { backgroundColor: theme.colors.card },
      isReply && styles.replyContainer
    ]}>
      <View style={styles.commentHeader}>
        <Text style={[styles.commentAuthor, { color: theme.colors.text }]}>
          {comment.author}
        </Text>
        <Text style={[styles.commentTimestamp, { color: theme.colors.textTertiary }]}>
          {comment.timestamp}
        </Text>
      </View>
      
      <Text style={[styles.commentContent, { color: theme.colors.textSecondary }]}>
        {comment.content}
      </Text>
      
      <View style={styles.commentActions}>
        <TouchableOpacity 
          style={styles.commentVote}
          onPress={() => handleVote('up', comment.id)}
        >
          <ArrowUp 
            size={14} 
            color={comment.isUpvoted ? theme.colors.primary : theme.colors.textTertiary}
            fill={comment.isUpvoted ? theme.colors.primary : 'none'}
          />
          <Text style={[styles.commentVoteCount, { color: theme.colors.textTertiary }]}>
            {comment.upvotes - comment.downvotes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.commentVote}
          onPress={() => handleVote('down', comment.id)}
        >
          <ArrowDown 
            size={14} 
            color={comment.isDownvoted ? theme.colors.error : theme.colors.textTertiary}
            fill={comment.isDownvoted ? theme.colors.error : 'none'}
          />
        </TouchableOpacity>
        
        {!isReply && (
          <TouchableOpacity 
            style={styles.replyButton}
            onPress={() => setReplyingTo(comment.id)}
          >
            <MessageCircle size={14} color={theme.colors.textTertiary} />
            <Text style={[styles.replyText, { color: theme.colors.textTertiary }]}>
              Reply
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Render replies */}
      {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Discussion</Text>
          <TouchableOpacity>
            <MoreHorizontal size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Post Content */}
          <View style={[styles.postContainer, { backgroundColor: theme.colors.card }]}>
            <View style={styles.postHeader}>
              <View style={styles.postMeta}>
                {post.isPinned && (
                  <View style={[styles.pinnedBadge, { backgroundColor: theme.colors.primary + '15' }]}>
                    <Text style={[styles.pinnedText, { color: theme.colors.primary }]}>Pinned</Text>
                  </View>
                )}
                <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary + '10' }]}>
                  <Text style={[styles.categoryText, { color: theme.colors.primary }]}>
                    {post.category}
                  </Text>
                </View>
              </View>
              <Text style={[styles.authorText, { color: theme.colors.textTertiary }]}>
                u/{post.author} • {post.timestamp}
              </Text>
            </View>
            
            <Text style={[styles.postTitle, { color: theme.colors.text }]}>
              {post.title}
            </Text>
            
            <Text style={[styles.postContent, { color: theme.colors.textSecondary }]}>
              {post.content}
            </Text>
            
            {/* Post Tags */}
            {post.tags.length > 0 && (
              <View style={styles.postTags}>
                {post.tags.map(tag => (
                  <View key={tag} style={[styles.postTag, { backgroundColor: theme.colors.backgroundSecondary }]}>
                    <Hash size={10} color={theme.colors.textTertiary} />
                    <Text style={[styles.postTagText, { color: theme.colors.textSecondary }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            {post.image && (
              <Image 
                source={{ uri: post.image }} 
                style={[styles.postImage, theme.shadow.small]} 
                resizeMode="cover"
              />
            )}
            
            {/* Post Actions */}
            <View style={styles.postActions}>
              <View style={styles.voteSection}>
                <TouchableOpacity 
                  style={[styles.voteButton, { backgroundColor: theme.colors.backgroundSecondary }]}
                  onPress={() => handleVote('up')}
                >
                  <ArrowUp 
                    size={18} 
                    color={post.isUpvoted ? theme.colors.primary : theme.colors.textTertiary}
                    fill={post.isUpvoted ? theme.colors.primary : 'none'}
                  />
                </TouchableOpacity>
                <Text style={[styles.voteCount, { color: theme.colors.text }]}>
                  {(post.upvotes - post.downvotes).toLocaleString()}
                </Text>
                <TouchableOpacity 
                  style={[styles.voteButton, { backgroundColor: theme.colors.backgroundSecondary }]}
                  onPress={() => handleVote('down')}
                >
                  <ArrowDown 
                    size={18} 
                    color={post.isDownvoted ? theme.colors.error : theme.colors.textTertiary}
                    fill={post.isDownvoted ? theme.colors.error : 'none'}
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={16} color={theme.colors.textTertiary} />
                  <Text style={[styles.actionText, { color: theme.colors.textTertiary }]}>
                    {post.comments.length}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Share size={16} color={theme.colors.textTertiary} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Bookmark 
                    size={16} 
                    color={post.isBookmarked ? theme.colors.primary : theme.colors.textTertiary}
                    fill={post.isBookmarked ? theme.colors.primary : 'none'}
                  />
                </TouchableOpacity>
                
                {post.awards && post.awards > 0 && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Award size={16} color={theme.colors.warning} />
                    <Text style={[styles.actionText, { color: theme.colors.textTertiary }]}>
                      {post.awards}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={[styles.commentsTitle, { color: theme.colors.text }]}>
              Comments ({post.comments.length})
            </Text>
            
            {post.comments.map(comment => renderComment(comment))}
            
            {post.comments.length === 0 && (
              <View style={styles.noComments}>
                <MessageCircle size={48} color={theme.colors.textTertiary} />
                <Text style={[styles.noCommentsText, { color: theme.colors.textTertiary }]}>
                  No comments yet. Be the first to comment!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={[styles.commentInput, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
          {replyingTo && (
            <View style={styles.replyingToIndicator}>
              <Text style={[styles.replyingToText, { color: theme.colors.textTertiary }]}>
                Replying to comment...
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Text style={[styles.cancelReply, { color: theme.colors.primary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.commentTextInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Add a comment..."
              placeholderTextColor={theme.colors.textTertiary}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                { 
                  backgroundColor: newComment.trim() ? theme.colors.primary : theme.colors.textTertiary + '30'
                }
              ]}
              onPress={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Send 
                size={20} 
                color={newComment.trim() ? theme.colors.background : theme.colors.textTertiary} 
              />
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
  },
  postContainer: {
    padding: 20,
    marginBottom: 8,
  },
  postHeader: {
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  pinnedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pinnedText: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  authorText: {
    fontSize: 12,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 26,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  postTags: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  postTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },
  postTagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voteButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 32,
    alignItems: 'center',
  },
  voteCount: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  commentsSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  commentContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  replyContainer: {
    marginLeft: 20,
    marginTop: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentTimestamp: {
    fontSize: 12,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  commentVote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentVoteCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noComments: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  noCommentsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  commentInput: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  replyingToIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyingToText: {
    fontSize: 12,
  },
  cancelReply: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  commentTextInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});