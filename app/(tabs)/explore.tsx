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
} from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  category: string;
  isPinned?: boolean;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  isBookmarked?: boolean;
  image?: string;
  awards?: number;
}

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Best strains for anxiety relief?',
    content: 'Looking for recommendations on strains that help with anxiety without making me too sleepy...',
    author: 'GreenThumb420',
    timestamp: '2h ago',
    upvotes: 124,
    downvotes: 5,
    comments: 42,
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
    comments: 28,
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
    comments: 65,
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
    comments: 123,
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
    comments: 134,
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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [sortBy, setSortBy] = useState<'trending' | 'recent'>('trending');

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    if (sortBy === 'trending') {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    } else {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
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
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={16} color={theme.colors.textTertiary} />
              <Text style={[styles.actionText, { color: theme.colors.textTertiary }]}>
                {post.comments} Comments
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
      </View>

      <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
        {sortedPosts.map(renderPost)}
      </ScrollView>
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
  },
  sectionHeader: {
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
  },
  postCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
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
});