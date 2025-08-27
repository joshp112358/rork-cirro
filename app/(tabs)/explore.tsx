import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
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
} from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: string;
  isPinned?: boolean;
  isLiked?: boolean;
}

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Best strains for anxiety relief?',
    content: 'Looking for recommendations on strains that help with anxiety without making me too sleepy...',
    author: 'GreenThumb420',
    timestamp: '2h ago',
    likes: 24,
    comments: 12,
    category: 'Medical',
    isPinned: true,
  },
  {
    id: '2',
    title: 'New dispensary opened downtown!',
    content: 'Just visited the new Green Valley dispensary. Great selection and friendly staff...',
    author: 'LocalExplorer',
    timestamp: '4h ago',
    likes: 18,
    comments: 8,
    category: 'Dispensaries',
  },
  {
    id: '3',
    title: 'Homemade edibles - dosage tips?',
    content: 'First time making brownies at home. Any advice on getting the dosage right?',
    author: 'BakeAndBake',
    timestamp: '6h ago',
    likes: 31,
    comments: 15,
    category: 'Edibles',
  },
  {
    id: '4',
    title: 'Vape vs flower - what do you prefer?',
    content: 'Trying to decide between getting a new vaporizer or sticking with flower...',
    author: 'VapeDebate',
    timestamp: '8h ago',
    likes: 42,
    comments: 23,
    category: 'General',
  },
  {
    id: '5',
    title: 'Growing tips for beginners',
    content: 'Starting my first grow setup. What are the most important things to know?',
    author: 'NewGrower',
    timestamp: '12h ago',
    likes: 67,
    comments: 34,
    category: 'Growing',
  },
];

const categories = ['All', 'Medical', 'Dispensaries', 'Edibles', 'General', 'Growing'];

export default function ExploreScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'trending' | 'recent'>('trending');

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    if (sortBy === 'trending') {
      return b.likes - a.likes;
    } else {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  const renderPost = (post: ForumPost) => (
    <TouchableOpacity key={post.id} style={[styles.postCard, { backgroundColor: theme.colors.card }]}>
      <View style={styles.postHeader}>
        <View style={styles.postTitleRow}>
          {post.isPinned && (
            <Pin size={16} color={theme.colors.primary} style={styles.pinIcon} />
          )}
          <Text style={[styles.postTitle, { color: theme.colors.text }]} numberOfLines={2}>
            {post.title}
          </Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary + '20' }]}>
          <Text style={[styles.categoryText, { color: theme.colors.primary }]}>
            {post.category}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.postContent, { color: theme.colors.textSecondary }]} numberOfLines={2}>
        {post.content}
      </Text>
      
      <View style={styles.postMeta}>
        <Text style={[styles.authorText, { color: theme.colors.textTertiary }]}>
          by {post.author} • {post.timestamp}
        </Text>
      </View>
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart 
            size={18} 
            color={post.isLiked ? theme.colors.primary : theme.colors.textTertiary}
            fill={post.isLiked ? theme.colors.primary : 'none'}
          />
          <Text style={[styles.actionText, { color: theme.colors.textTertiary }]}>
            {post.likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={18} color={theme.colors.textTertiary} />
          <Text style={[styles.actionText, { color: theme.colors.textTertiary }]}>
            {post.comments}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Share size={18} color={theme.colors.textTertiary} />
        </TouchableOpacity>
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === category 
                  ? theme.colors.primary 
                  : theme.colors.card,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                {
                  color: selectedCategory === category 
                    ? theme.colors.background 
                    : theme.colors.text,
                }
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  postsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  postCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  postTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  pinIcon: {
    marginRight: 6,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
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
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  postMeta: {
    marginBottom: 12,
  },
  authorText: {
    fontSize: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
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