import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Heart, MessageCircle, Share, MoreHorizontal, Users, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';

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
  comments: number;
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
    caption: 'Perfect for a creative afternoon session. The colors are incredible! 🎨',
    likes: 127,
    comments: 23,
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
    caption: 'Best sleep strain I\'ve tried. Knocked me out in the best way possible 😴',
    likes: 89,
    comments: 15,
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
    caption: 'The perfect balance. Great for both day and night sessions. Highly recommend! 🌟',
    likes: 203,
    comments: 41,
    timestamp: '6h',
    liked: false,
  },
];

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const [posts, setPosts] = useState(mockPosts);
  const [activeTab, setActiveTab] = useState<'trending' | 'following'>('trending');

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
        <Text style={styles.headerTitle}>Discover</Text>
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
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={20} color={theme.colors.textSecondary} strokeWidth={1.5} />
                    <Text style={styles.actionText}>{post.comments}</Text>
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
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.heavy,
    color: theme.colors.text,
    letterSpacing: -0.5,
    marginBottom: theme.spacing.lg,
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
});