import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Search,
  Plus,
  MessageCircle,
  Heart,
  Share,
  TrendingUp,
  Clock,
  Users,
  Pin,
  ArrowUp,
  ArrowDown,
  Bookmark,
  Award,
  Image as ImageIcon,
  Send,
  X,
  MapPin,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useLocation } from '@/hooks/use-location';

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
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
}

const initialMockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Best strains for anxiety relief?',
    content: 'Looking for recommendations on strains that help with anxiety without making me too sleepy...',
    author: 'GreenThumb420',
    timestamp: '2h ago',
    upvotes: 124,
    downvotes: 5,
    comments: [
      {
        id: 'c1',
        content: 'I recommend Blue Dream or Northern Lights. Both are great for anxiety without being too sedating.',
        author: 'MedicalUser',
        timestamp: '1h ago',
        upvotes: 12,
        downvotes: 0,
      },
      {
        id: 'c2',
        content: 'CBD dominant strains like Charlotte\'s Web work wonders for me!',
        author: 'AnxietyFree',
        timestamp: '45m ago',
        upvotes: 8,
        downvotes: 1,
      },
    ],
    category: 'Medical',
    isPinned: true,
    awards: 2,
  },
  {
    id: '2',
    title: 'New dispensary opened downtown!',
    content: 'Just visited the new Green Valley dispensary. Great selection and friendly staff...',
    author: 'LocalExplorer',
    timestamp: '4h ago',
    upvotes: 98,
    downvotes: 12,
    comments: [
      {
        id: 'c3',
        content: 'Thanks for the heads up! Will definitely check it out.',
        author: 'LocalBud',
        timestamp: '3h ago',
        upvotes: 5,
        downvotes: 0,
      },
    ],
    category: 'Dispensaries',
    image: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=1000',
  },
  {
    id: '3',
    title: 'Homemade edibles - dosage tips?',
    content: 'First time making brownies at home. Any advice on getting the dosage right?',
    author: 'BakeAndBake',
    timestamp: '6h ago',
    upvotes: 231,
    downvotes: 8,
    comments: [
      {
        id: 'c4',
        content: 'Start low, go slow! 5-10mg is a good starting point.',
        author: 'EdibleExpert',
        timestamp: '5h ago',
        upvotes: 15,
        downvotes: 0,
      },
      {
        id: 'c5',
        content: 'Make sure to decarb your flower properly first!',
        author: 'HomeBaker',
        timestamp: '4h ago',
        upvotes: 12,
        downvotes: 0,
      },
    ],
    category: 'Edibles',
    awards: 1,
  },
  {
    id: '4',
    title: 'Vape vs flower - what do you prefer?',
    content: 'Trying to decide between getting a new vaporizer or sticking with flower...',
    author: 'VapeDebate',
    timestamp: '8h ago',
    upvotes: 342,
    downvotes: 18,
    comments: [],
    category: 'General',
    image: 'https://images.unsplash.com/photo-1560999448-1be675dd1310?q=80&w=1000',
  },
  {
    id: '5',
    title: 'Growing tips for beginners',
    content: 'Starting my first grow setup. What are the most important things to know?',
    author: 'NewGrower',
    timestamp: '12h ago',
    upvotes: 467,
    downvotes: 21,
    comments: [],
    category: 'Growing',
    awards: 3,
  },
];



interface Highlight {
  id: string;
  title: string;
  image: string;
  upvotes: number;
  category: string;
}

const highlights: Highlight[] = [
  {
    id: 'h1',
    title: 'Purple Haze Review: A Classic Strain Worth Revisiting',
    image: 'https://images.unsplash.com/photo-1536689318884-9b1dc7dd27a5?q=80&w=1000',
    upvotes: 1243,
    category: 'Strains'
  },
  {
    id: 'h2',
    title: 'How to Make the Perfect Cannabis Infused Chocolate',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000',
    upvotes: 876,
    category: 'Edibles'
  },
  {
    id: 'h3',
    title: 'Best Dispensaries in California: 2025 Edition',
    image: 'https://images.unsplash.com/photo-1589579234096-07ecd0f39eef?q=80&w=1000',
    upvotes: 654,
    category: 'Dispensaries'
  },
  {
    id: 'h4',
    title: 'CBD for Anxiety: My 30-Day Experience',
    image: 'https://images.unsplash.com/photo-1590114538379-921f0b17b45f?q=80&w=1000',
    upvotes: 1876,
    category: 'Medical'
  },
  {
    id: 'h5',
    title: 'Indoor Growing Setup for Under $500',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1000',
    upvotes: 932,
    category: 'Growing'
  }
];

export default function ExploreScreen() {
  const { theme } = useTheme();
  const { location, isLoading: locationLoading, requestPermission, hasPermission } = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'nearme'>('trending');
  const [posts, setPosts] = useState<ForumPost[]>(initialMockPosts);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    if (sortBy === 'trending') {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    } else if (sortBy === 'recent') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sortBy === 'nearme') {
      // For demo purposes, just sort by trending when near me is selected
      // In a real app, this would sort by distance from user's location
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    }
    return 0;
  });

  const renderHighlight = ({ item }: { item: Highlight }) => (
    <TouchableOpacity style={styles.highlightCard}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.highlightImage} 
        resizeMode="cover"
      />
      <View style={[styles.highlightOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
        <View style={styles.highlightContent}>
          <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary + '30' }]}>
            <Text style={[styles.categoryText, { color: theme.colors.background }]}>
              {item.category}
            </Text>
          </View>
          <Text style={[styles.highlightTitle, { color: theme.colors.background }]} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.highlightMeta}>
            <ArrowUp size={14} color={theme.colors.background} />
            <Text style={[styles.highlightUpvotes, { color: theme.colors.background }]}>
              {item.upvotes}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPost = (post: ForumPost) => (
    <TouchableOpacity key={post.id} style={[styles.postCard, { backgroundColor: theme.colors.card }]}>
      <View style={styles.postContainer}>
        {/* Vote column */}
        <View style={styles.voteColumn}>
          <TouchableOpacity style={styles.voteButton}>
            <ArrowUp 
              size={16} 
              color={post.isUpvoted ? theme.colors.primary : theme.colors.textTertiary}
              fill={post.isUpvoted ? theme.colors.primary : 'none'}
            />
          </TouchableOpacity>
          <Text style={[styles.voteCount, { color: theme.colors.text }]}>
            {post.upvotes - post.downvotes}
          </Text>
          <TouchableOpacity style={styles.voteButton}>
            <ArrowDown 
              size={16} 
              color={post.isDownvoted ? theme.colors.error : theme.colors.textTertiary}
              fill={post.isDownvoted ? theme.colors.error : 'none'}
            />
          </TouchableOpacity>
        </View>

        {/* Content column */}
        <View style={styles.contentColumn}>
          <View style={styles.postHeader}>
            <View style={styles.postMeta}>
              {post.isPinned && (
                <Pin size={14} color={theme.colors.primary} style={styles.pinIcon} />
              )}
              <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.categoryText, { color: theme.colors.primary }]}>
                  {post.category}
                </Text>
              </View>
              <Text style={[styles.authorText, { color: theme.colors.textTertiary }]}>
                Posted by {post.author} • {post.timestamp}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.postTitle, { color: theme.colors.text }]} numberOfLines={2}>
            {post.title}
          </Text>
          
          <Text style={[styles.postContent, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {post.content}
          </Text>
          
          {post.image && (
            <Image 
              source={{ uri: post.image }} 
              style={styles.postImage} 
              resizeMode="cover"
            />
          )}
          
          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setSelectedPost(post);
                setShowComments(true);
              }}
            >
              <MessageCircle size={16} color={theme.colors.textTertiary} />
              <Text style={[styles.actionText, { color: theme.colors.textTertiary }]}>
                {post.comments.length} Comments
              </Text>
            </TouchableOpacity>
            
            {post.awards && post.awards > 0 && (
              <TouchableOpacity style={styles.actionButton}>
                <Award size={16} color={theme.colors.warning} />
                <Text style={[styles.actionText, { color: theme.colors.textTertiary }]}>
                  {post.awards}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.actionButton}>
              <Share size={16} color={theme.colors.textTertiary} />
              <Text style={[styles.actionText, { color: theme.colors.textTertiary }]}>
                Share
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Bookmark 
                size={16} 
                color={post.isBookmarked ? theme.colors.primary : theme.colors.textTertiary}
                fill={post.isBookmarked ? theme.colors.primary : 'none'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Explore</Text>
        <TouchableOpacity style={[styles.createButton, { backgroundColor: theme.colors.primary }]}>
          <Plus size={20} color={theme.colors.background} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search discussions..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
        {/* Highlights Section */}
        <View style={styles.highlightsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trending Today</Text>
          </View>
          <FlatList
            data={highlights}
            renderItem={renderHighlight}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightsContainer}
          />
        </View>

        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'trending' && { backgroundColor: theme.colors.primary + '20' }
            ]}
            onPress={() => setSortBy('trending')}
          >
            <TrendingUp 
              size={16} 
              color={sortBy === 'trending' ? theme.colors.primary : theme.colors.textTertiary} 
            />
            <Text
              style={[
                styles.sortText,
                {
                  color: sortBy === 'trending' ? theme.colors.primary : theme.colors.textTertiary,
                }
              ]}
            >
              Trending
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'recent' && { backgroundColor: theme.colors.primary + '20' }
            ]}
            onPress={() => setSortBy('recent')}
          >
            <Clock 
              size={16} 
              color={sortBy === 'recent' ? theme.colors.primary : theme.colors.textTertiary} 
            />
            <Text
              style={[
                styles.sortText,
                {
                  color: sortBy === 'recent' ? theme.colors.primary : theme.colors.textTertiary,
                }
              ]}
            >
              Recent
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'nearme' && { backgroundColor: theme.colors.primary + '20' }
            ]}
            onPress={async () => {
              if (!hasPermission) {
                const granted = await requestPermission();
                if (granted) {
                  setSortBy('nearme');
                }
              } else {
                setSortBy('nearme');
              }
            }}
          >
            <MapPin 
              size={16} 
              color={sortBy === 'nearme' ? theme.colors.primary : theme.colors.textTertiary} 
            />
            <Text
              style={[
                styles.sortText,
                {
                  color: sortBy === 'nearme' ? theme.colors.primary : theme.colors.textTertiary,
                }
              ]}
            >
              {locationLoading ? 'Loading...' : 'Near Me'}
            </Text>
          </TouchableOpacity>
        </View>

        {sortedPosts.map(renderPost)}
      </ScrollView>

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <KeyboardAvoidingView 
            style={styles.modalContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Comments</Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowComments(false);
                  setSelectedPost(null);
                  setNewComment('');
                }}
              >
                <X size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {selectedPost && (
              <>
                {/* Post Summary */}
                <View style={[styles.postSummary, { backgroundColor: theme.colors.card }]}>
                  <Text style={[styles.postSummaryTitle, { color: theme.colors.text }]} numberOfLines={2}>
                    {selectedPost.title}
                  </Text>
                  <Text style={[styles.postSummaryMeta, { color: theme.colors.textTertiary }]}>
                    by {selectedPost.author} • {selectedPost.timestamp}
                  </Text>
                </View>

                {/* Comments List */}
                <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
                  {selectedPost.comments.map((comment) => (
                    <View key={comment.id} style={[styles.commentItem, { backgroundColor: theme.colors.card }]}>
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
                        <TouchableOpacity style={styles.commentVote}>
                          <ArrowUp 
                            size={14} 
                            color={comment.isUpvoted ? theme.colors.primary : theme.colors.textTertiary}
                            fill={comment.isUpvoted ? theme.colors.primary : 'none'}
                          />
                          <Text style={[styles.commentVoteCount, { color: theme.colors.textTertiary }]}>
                            {comment.upvotes - comment.downvotes}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentVote}>
                          <ArrowDown 
                            size={14} 
                            color={comment.isDownvoted ? theme.colors.error : theme.colors.textTertiary}
                            fill={comment.isDownvoted ? theme.colors.error : 'none'}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  
                  {selectedPost.comments.length === 0 && (
                    <View style={styles.noComments}>
                      <MessageCircle size={48} color={theme.colors.textTertiary} />
                      <Text style={[styles.noCommentsText, { color: theme.colors.textTertiary }]}>
                        No comments yet. Be the first to comment!
                      </Text>
                    </View>
                  )}
                </ScrollView>

                {/* Comment Input */}
                <View style={[styles.commentInput, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
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
                    onPress={() => {
                      if (newComment.trim() && selectedPost) {
                        const newCommentObj: Comment = {
                          id: `c${Date.now()}`,
                          content: newComment.trim(),
                          author: 'You', // In a real app, this would be the current user
                          timestamp: 'now',
                          upvotes: 0,
                          downvotes: 0,
                        };
                        
                        // Update the posts state
                        setPosts(prevPosts => 
                          prevPosts.map(post => 
                            post.id === selectedPost.id 
                              ? { ...post, comments: [...post.comments, newCommentObj] }
                              : post
                          )
                        );
                        
                        // Update the selected post
                        setSelectedPost(prev => 
                          prev ? { ...prev, comments: [...prev.comments, newCommentObj] } : null
                        );
                        
                        setNewComment('');
                      }
                    }}
                    disabled={!newComment.trim()}
                  >
                    <Send 
                      size={20} 
                      color={newComment.trim() ? theme.colors.background : theme.colors.textTertiary} 
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  // Highlights section
  highlightsSection: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  highlightsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  highlightCard: {
    width: 240,
    height: 160,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  highlightImage: {
    width: '100%',
    height: '100%',
  },
  highlightOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  highlightContent: {
    padding: 12,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  highlightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  highlightUpvotes: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Categories
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Sort controls
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Posts
  postsContainer: {
    flex: 1,
  },
  postCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 20,
  },
  postContainer: {
    flexDirection: 'row',
  },
  voteColumn: {
    alignItems: 'center',
    marginRight: 12,
    paddingTop: 4,
  },
  voteButton: {
    padding: 4,
  },
  voteCount: {
    fontSize: 13,
    fontWeight: '600',
    marginVertical: 4,
  },
  contentColumn: {
    flex: 1,
  },
  postHeader: {
    marginBottom: 8,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  pinIcon: {
    marginRight: 2,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
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
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  postSummary: {
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
  },
  postSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  postSummaryMeta: {
    fontSize: 12,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  commentItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
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