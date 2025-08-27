import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { MessageSquare, Plus, Heart, MessageCircle, Share, MoreHorizontal, Search, TrendingUp, Clock, Users } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  category: 'General' | 'Strains' | 'Growing' | 'Medical' | 'Reviews' | 'News';
  likes: number;
  replies: number;
  views: number;
  timestamp: string;
  liked: boolean;
  pinned?: boolean;
  tags: string[];
}

interface Reply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  likes: number;
  timestamp: string;
  liked: boolean;
}

const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Best strains for anxiety relief?',
    content: 'Looking for recommendations for strains that help with anxiety without making me too sleepy. Any suggestions?',
    author: {
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    category: 'Medical',
    likes: 24,
    replies: 12,
    views: 156,
    timestamp: '2h',
    liked: false,
    pinned: true,
    tags: ['anxiety', 'medical', 'recommendations'],
  },
  {
    id: '2',
    title: 'Purple Haze Review - Amazing for creativity!',
    content: 'Just tried Purple Haze for the first time and wow! Perfect for creative sessions. The colors are incredible and my focus is on point.',
    author: {
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: false,
    },
    category: 'Reviews',
    likes: 18,
    replies: 8,
    views: 89,
    timestamp: '4h',
    liked: true,
    tags: ['purple-haze', 'sativa', 'creativity', 'review'],
  },
  {
    id: '3',
    title: 'Growing tips for beginners?',
    content: 'Starting my first grow setup. Any essential tips for a complete beginner? What mistakes should I avoid?',
    author: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    category: 'Growing',
    likes: 31,
    replies: 15,
    views: 203,
    timestamp: '6h',
    liked: false,
    tags: ['growing', 'beginner', 'tips', 'setup'],
  },
  {
    id: '4',
    title: 'New dispensary opened downtown!',
    content: 'Green Valley Dispensary just opened on Main Street. Great selection and friendly staff. Anyone else been there yet?',
    author: {
      name: 'Emma K.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      verified: false,
    },
    category: 'News',
    likes: 12,
    replies: 6,
    views: 67,
    timestamp: '8h',
    liked: false,
    tags: ['dispensary', 'news', 'downtown'],
  },
];

export default function ForumsScreen() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<ForumPost[]>(mockForumPosts);
  const [activeFilter, setActiveFilter] = useState<'all' | 'trending' | 'recent'>('all');
  const [searchText, setSearchText] = useState('');

  const categories = ['All', 'General', 'Strains', 'Growing', 'Medical', 'Reviews', 'News'];
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const handleCreatePost = () => {
    Alert.alert('Create Post', 'Post creation feature coming soon!');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'General':
        return '#6B7280';
      case 'Strains':
        return '#10B981';
      case 'Growing':
        return '#059669';
      case 'Medical':
        return '#DC2626';
      case 'Reviews':
        return '#7C3AED';
      case 'News':
        return '#2563EB';
      default:
        return theme.colors.textSecondary;
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = searchText === '' || 
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.content.toLowerCase().includes(searchText.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    switch (activeFilter) {
      case 'trending':
        return (b.likes + b.replies) - (a.likes + a.replies);
      case 'recent':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      default:
        return 0;
    }
  });

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <MessageSquare size={24} color={theme.colors.primary} strokeWidth={1.5} />
            <Text style={styles.headerTitle}>Forums</Text>
          </View>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreatePost}
          >
            <Plus size={18} color={theme.colors.background} strokeWidth={1.5} />
            <Text style={styles.createButtonText}>New Post</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search forums..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipSelected
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextSelected
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.filterContainer}>
          {(['all', 'trending', 'recent'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              {filter === 'trending' && <TrendingUp size={16} color={activeFilter === filter ? theme.colors.primary : theme.colors.textSecondary} strokeWidth={1.5} />}
              {filter === 'recent' && <Clock size={16} color={activeFilter === filter ? theme.colors.primary : theme.colors.textSecondary} strokeWidth={1.5} />}
              {filter === 'all' && <Users size={16} color={activeFilter === filter ? theme.colors.primary : theme.colors.textSecondary} strokeWidth={1.5} />}
              <Text style={[
                styles.filterButtonText,
                activeFilter === filter && styles.filterButtonTextActive
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={sortedPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsContent}
        renderItem={({ item: post }) => (
          <TouchableOpacity style={styles.postCard}>
            {post.pinned && (
              <View style={styles.pinnedBadge}>
                <Text style={styles.pinnedText}>PINNED</Text>
              </View>
            )}
            
            <View style={styles.postHeader}>
              <View style={styles.authorInfo}>
                <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
                <View style={styles.authorDetails}>
                  <View style={styles.authorNameRow}>
                    <Text style={styles.authorName}>{post.author.name}</Text>
                    {post.author.verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.postTimestamp}>{post.timestamp}</Text>
                </View>
              </View>
              
              <View style={styles.postMeta}>
                <View style={[
                  styles.categoryBadge,
                  { backgroundColor: getCategoryColor(post.category) }
                ]}>
                  <Text style={styles.categoryText}>{post.category}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreHorizontal size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContentText} numberOfLines={3}>
                {post.content}
              </Text>
              
              <View style={styles.tagsContainer}>
                {post.tags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
                {post.tags.length > 3 && (
                  <Text style={styles.moreTags}>+{post.tags.length - 3}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(post.id)}
              >
                <Heart 
                  size={18} 
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
                <MessageCircle size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />
                <Text style={styles.actionText}>{post.replies}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Share size={18} color={theme.colors.textSecondary} strokeWidth={1.5} />
              </TouchableOpacity>
              
              <View style={styles.viewsContainer}>
                <Text style={styles.viewsText}>{post.views} views</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MessageSquare size={48} color={theme.colors.textSecondary} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No posts found</Text>
            <Text style={styles.emptyText}>
              {searchText ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
            </Text>
          </View>
        }
      />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.heavy,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
  },
  createButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
  },
  categoriesScroll: {
    marginBottom: theme.spacing.lg,
  },
  categoriesContent: {
    paddingRight: theme.spacing.xl,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.round,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.text,
  },
  categoryChipTextSelected: {
    color: theme.colors.background,
    fontWeight: theme.fontWeight.medium,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.cardSecondary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterButtonTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  postsContent: {
    paddingBottom: theme.spacing.xl,
  },
  postCard: {
    backgroundColor: theme.colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    position: 'relative',
  },
  pinnedBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  pinnedText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.heavy,
    color: theme.colors.background,
    letterSpacing: 0.5,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  authorDetails: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: 2,
  },
  authorName: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 8,
    color: theme.colors.background,
    fontWeight: theme.fontWeight.heavy,
  },
  postTimestamp: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  postMeta: {
    alignItems: 'flex-end',
    gap: theme.spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moreButton: {
    padding: theme.spacing.xs,
  },
  postContent: {
    marginBottom: theme.spacing.md,
  },
  postTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    lineHeight: theme.lineHeight.tight * theme.fontSize.lg,
    marginBottom: theme.spacing.sm,
  },
  postContentText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.md,
    marginBottom: theme.spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.cardSecondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  tagText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  moreTags: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  actionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  viewsContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  viewsText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.light,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.lineHeight.relaxed * theme.fontSize.sm,
  },
});