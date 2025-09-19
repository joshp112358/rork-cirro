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
  Hash,
  Users2,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useLocation } from '@/hooks/use-location';
import { useCommunities } from '@/hooks/use-communities';
import { router } from 'expo-router';

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
  communities: string[];
}

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

const initialMockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Best strains for anxiety relief?',
    content: 'Looking for recommendations on strains that help with anxiety without making me too sleepy. I\'ve tried a few but they either don\'t work or knock me out completely.',
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
    communities: ['medical', 'beginners'],
  },
  {
    id: '2',
    title: 'New dispensary opened downtown!',
    content: 'Just visited the new Green Valley dispensary. Great selection and friendly staff. They have some rare strains I haven\'t seen elsewhere.',
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
    communities: ['local', 'reviews'],
  },
  {
    id: '3',
    title: 'Homemade edibles - dosage tips?',
    content: 'First time making brownies at home. Any advice on getting the dosage right? I don\'t want to end up on Mars 🚀',
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
    communities: ['beginners', 'edibles'],
  },
  {
    id: '4',
    title: 'Vape vs flower - what do you prefer?',
    content: 'Trying to decide between getting a new vaporizer or sticking with flower. What are the pros and cons of each?',
    author: 'VapeDebate',
    timestamp: '8h ago',
    upvotes: 342,
    downvotes: 18,
    comments: [
      {
        id: 'c6',
        content: 'Vaping is more efficient and healthier, but nothing beats the ritual of smoking flower.',
        author: 'VapeVet',
        timestamp: '7h ago',
        upvotes: 23,
        downvotes: 2,
      },
    ],
    category: 'General',
    image: 'https://images.unsplash.com/photo-1560999448-1be675dd1310?q=80&w=1000',
    communities: ['general', 'veterans'],
  },
  {
    id: '5',
    title: 'Growing tips for beginners',
    content: 'Starting my first grow setup. What are the most important things to know? Budget is around $500.',
    author: 'NewGrower',
    timestamp: '12h ago',
    upvotes: 467,
    downvotes: 21,
    comments: [
      {
        id: 'c7',
        content: 'Light is everything! Invest in a good LED setup first.',
        author: 'GrowMaster',
        timestamp: '11h ago',
        upvotes: 34,
        downvotes: 1,
      },
    ],
    category: 'Growing',
    awards: 3,
    communities: ['beginners', 'growers'],
  },
  {
    id: '6',
    title: 'Purple Punch review - holy moly! 🍇',
    content: 'Just tried Purple Punch for the first time and WOW. The flavor is incredible and the effects are perfect for evening relaxation. Highly recommend!',
    author: 'StrainHunter',
    timestamp: '1d ago',
    upvotes: 189,
    downvotes: 7,
    comments: [
      {
        id: 'c8',
        content: 'Purple Punch is my go-to for sleep! Love that grape flavor.',
        author: 'SleepyHead',
        timestamp: '23h ago',
        upvotes: 18,
        downvotes: 0,
      },
      {
        id: 'c9',
        content: 'Where did you get it? Been looking everywhere for this strain.',
        author: 'PurpleSeeker',
        timestamp: '22h ago',
        upvotes: 9,
        downvotes: 0,
      },
    ],
    category: 'Strains',
    image: 'https://images.unsplash.com/photo-1536689318884-9b1dc7dd27a5?q=80&w=1000',
    awards: 1,
    communities: ['reviews', 'veterans'],
  },
  {
    id: '7',
    title: 'Cannabis and creativity - your experiences?',
    content: 'I\'m an artist and I\'ve noticed certain strains really boost my creativity. What strains work best for you creative folks?',
    author: 'ArtisticSoul',
    timestamp: '1d ago',
    upvotes: 276,
    downvotes: 12,
    comments: [
      {
        id: 'c10',
        content: 'Sour Diesel is my creative fuel! Gets the ideas flowing.',
        author: 'CreativeWriter',
        timestamp: '1d ago',
        upvotes: 21,
        downvotes: 1,
      },
    ],
    category: 'General',
    communities: ['general', 'veterans'],
  },
  {
    id: '8',
    title: 'First time at a dispensary - what to expect?',
    content: 'Finally got my medical card! Going to my first dispensary tomorrow. Any tips for a newbie?',
    author: 'FirstTimer',
    timestamp: '2d ago',
    upvotes: 156,
    downvotes: 3,
    comments: [
      {
        id: 'c11',
        content: 'Don\'t be shy to ask questions! Budtenders are there to help.',
        author: 'FriendlyBudtender',
        timestamp: '2d ago',
        upvotes: 28,
        downvotes: 0,
      },
      {
        id: 'c12',
        content: 'Bring cash and your ID! Most places don\'t take cards yet.',
        author: 'ExperiencedUser',
        timestamp: '2d ago',
        upvotes: 19,
        downvotes: 0,
      },
    ],
    category: 'Dispensaries',
    communities: ['beginners', 'local'],
  },
  {
    id: '9',
    title: 'Made cannabis-infused honey! 🍯',
    content: 'Just finished my first batch of cannabis honey. The process was easier than I thought! Perfect for tea or toast.',
    author: 'HoneyMaker',
    timestamp: '2d ago',
    upvotes: 203,
    downvotes: 8,
    comments: [
      {
        id: 'c13',
        content: 'Recipe please! This sounds amazing.',
        author: 'SweetTooth',
        timestamp: '2d ago',
        upvotes: 15,
        downvotes: 0,
      },
    ],
    category: 'Edibles',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1000',
    communities: ['edibles', 'veterans'],
  },
  {
    id: '10',
    title: 'Terpenes explained - why they matter',
    content: 'Deep dive into terpenes and how they affect your high. Myrcene, limonene, pinene - what do they all do?',
    author: 'TerpeneTeacher',
    timestamp: '3d ago',
    upvotes: 445,
    downvotes: 15,
    comments: [
      {
        id: 'c14',
        content: 'This is so helpful! I never understood why the same THC% felt different.',
        author: 'LearningUser',
        timestamp: '3d ago',
        upvotes: 32,
        downvotes: 0,
      },
    ],
    category: 'Education',
    isPinned: true,
    awards: 2,
    communities: ['beginners', 'veterans'],
  },
  {
    id: '11',
    title: 'Micro-dosing with edibles - game changer!',
    content: 'Started micro-dosing with 2.5mg gummies and it\'s been amazing for productivity and mood. Anyone else tried this?',
    author: 'MicroDoser',
    timestamp: '3d ago',
    upvotes: 312,
    downvotes: 22,
    comments: [
      {
        id: 'c15',
        content: 'Yes! 2-3mg is perfect for daytime use without impairment.',
        author: 'ProductiveStoner',
        timestamp: '3d ago',
        upvotes: 24,
        downvotes: 1,
      },
    ],
    category: 'Medical',
    communities: ['medical', 'edibles'],
  },
  {
    id: '12',
    title: 'Indoor vs outdoor grown - can you taste the difference?',
    content: 'Been debating with friends about whether you can actually taste the difference between indoor and outdoor grown cannabis. Thoughts?',
    author: 'FlavorChaser',
    timestamp: '4d ago',
    upvotes: 198,
    downvotes: 31,
    comments: [
      {
        id: 'c16',
        content: 'Outdoor has more complex terpene profiles in my experience.',
        author: 'OutdoorGrower',
        timestamp: '4d ago',
        upvotes: 17,
        downvotes: 3,
      },
    ],
    category: 'Growing',
    communities: ['growers', 'veterans'],
  },
  {
    id: '13',
    title: 'Cannabis for seniors - my grandmother\'s journey',
    content: 'My 78-year-old grandmother started using CBD for arthritis pain. The results have been incredible. Sharing her story.',
    author: 'GrandchildAdvocate',
    timestamp: '4d ago',
    upvotes: 567,
    downvotes: 8,
    comments: [
      {
        id: 'c17',
        content: 'This is beautiful! Cannabis can really improve quality of life.',
        author: 'CompassionateUser',
        timestamp: '4d ago',
        upvotes: 43,
        downvotes: 0,
      },
    ],
    category: 'Medical',
    awards: 4,
    communities: ['seniors', 'medical'],
  },
  {
    id: '14',
    title: 'Best rolling papers? Let\'s settle this debate',
    content: 'Raw, Zig-Zag, OCB, or something else? What\'s your go-to rolling paper and why?',
    author: 'RollingMaster',
    timestamp: '5d ago',
    upvotes: 234,
    downvotes: 18,
    comments: [
      {
        id: 'c18',
        content: 'Raw Black all the way! Burns so clean.',
        author: 'CleanBurner',
        timestamp: '5d ago',
        upvotes: 29,
        downvotes: 2,
      },
    ],
    category: 'General',
    communities: ['general', 'veterans'],
  },
  {
    id: '15',
    title: 'Cannabis business opportunities in 2025',
    content: 'With more states legalizing, what business opportunities do you see emerging? Thinking about getting into the industry.',
    author: 'BusinessMinded',
    timestamp: '5d ago',
    upvotes: 189,
    downvotes: 25,
    comments: [
      {
        id: 'c19',
        content: 'Delivery services and cannabis tourism are huge growth areas.',
        author: 'IndustryInsider',
        timestamp: '5d ago',
        upvotes: 22,
        downvotes: 1,
      },
    ],
    category: 'Business',
    communities: ['entrepreneurs', 'general'],
  },
  {
    id: '16',
    title: 'Harvest day! First grow complete 🌿',
    content: 'After 4 months, finally harvested my first plants! Northern Lights auto. So proud of these ladies.',
    author: 'ProudGrower',
    timestamp: '6d ago',
    upvotes: 423,
    downvotes: 12,
    comments: [
      {
        id: 'c20',
        content: 'Congratulations! Nothing beats your own homegrown.',
        author: 'VeteranGrower',
        timestamp: '6d ago',
        upvotes: 31,
        downvotes: 0,
      },
    ],
    category: 'Growing',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=1000',
    awards: 2,
    communities: ['growers', 'beginners'],
  },
  {
    id: '17',
    title: 'Cannabis and exercise - performance enhancer?',
    content: 'Been using cannabis before workouts and I swear it helps with focus and recovery. Anyone else experience this?',
    author: 'FitStoner',
    timestamp: '6d ago',
    upvotes: 267,
    downvotes: 34,
    comments: [
      {
        id: 'c21',
        content: 'CBD is great for recovery, THC helps me get in the zone.',
        author: 'AthleteUser',
        timestamp: '6d ago',
        upvotes: 19,
        downvotes: 2,
      },
    ],
    category: 'Lifestyle',
    communities: ['general', 'medical'],
  },
  {
    id: '18',
    title: 'Dispensary etiquette - do\'s and don\'ts',
    content: 'Working at a dispensary for 2 years now. Here are some tips to make everyone\'s experience better.',
    author: 'BudtenderPro',
    timestamp: '1w ago',
    upvotes: 356,
    downvotes: 9,
    comments: [
      {
        id: 'c22',
        content: 'Thank you for this! Didn\'t know about the smell jar etiquette.',
        author: 'PoliteCustomer',
        timestamp: '1w ago',
        upvotes: 25,
        downvotes: 0,
      },
    ],
    category: 'Dispensaries',
    isPinned: true,
    communities: ['local', 'beginners'],
  },
  {
    id: '19',
    title: 'Cannabis cooking fails - learn from my mistakes!',
    content: 'Made every mistake in the book when I started cooking with cannabis. Here\'s what NOT to do...',
    author: 'CookingFails',
    timestamp: '1w ago',
    upvotes: 445,
    downvotes: 16,
    comments: [
      {
        id: 'c23',
        content: 'The butter burning story had me dying! 😂',
        author: 'LaughingChef',
        timestamp: '1w ago',
        upvotes: 33,
        downvotes: 0,
      },
    ],
    category: 'Edibles',
    awards: 1,
    communities: ['edibles', 'beginners'],
  },
  {
    id: '20',
    title: 'Local cannabis events this weekend',
    content: 'Hemp fest downtown Saturday, and there\'s a grow workshop Sunday. Who\'s going?',
    author: 'EventPlanner',
    timestamp: '1w ago',
    upvotes: 123,
    downvotes: 5,
    comments: [
      {
        id: 'c24',
        content: 'See you at the hemp fest! Can\'t wait.',
        author: 'FestivalGoer',
        timestamp: '1w ago',
        upvotes: 12,
        downvotes: 0,
      },
    ],
    category: 'Events',
    communities: ['local', 'general'],
  }
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
  const { joinedCommunities, joinCommunity, leaveCommunity, isJoined } = useCommunities();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'nearme'>('recent');
  const [posts, setPosts] = useState<ForumPost[]>(initialMockPosts);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);

  // Get popular communities based on posts
  const popularCommunities = communities
    .filter(community => posts.some(post => post.communities.includes(community.id)))
    .sort((a, b) => b.memberCount - a.memberCount);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCommunities = selectedCommunities.length === 0 || selectedCommunities.some(communityId => post.communities.includes(communityId));
    
    // Only show posts from communities the user has joined
    const hasJoinedCommunity = post.communities.some(communityId => isJoined(communityId));
    
    return matchesSearch && matchesCommunities && hasJoinedCommunity;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    if (sortBy === 'recent') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sortBy === 'nearme') {
      // For demo purposes, just sort by trending when near me is selected
      // In a real app, this would sort by distance from user's location
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    }
    return 0;
  });

  const renderHighlight = ({ item }: { item: Highlight }) => (
    <TouchableOpacity style={[styles.highlightCard, theme.shadow.medium]}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.highlightImage} 
        resizeMode="cover"
      />
      <View style={styles.highlightOverlay}>
        <View style={styles.highlightContent}>
          <View style={[styles.categoryBadge, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <Text style={[styles.categoryText, { color: theme.colors.primary }]}>
              {item.category}
            </Text>
          </View>
          <Text style={[styles.highlightTitle, { color: theme.colors.background }]} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.highlightMeta}>
            <View style={styles.highlightMetaItem}>
              <ArrowUp size={12} color={theme.colors.background} />
              <Text style={[styles.highlightUpvotes, { color: theme.colors.background }]}>
                {item.upvotes.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPost = (post: ForumPost) => (
    <TouchableOpacity 
      key={post.id} 
      style={[styles.postCard, { backgroundColor: theme.colors.card }, theme.shadow.small]}
      onPress={() => router.push(`/thread/${post.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.postContainer}>
        {/* Vote column */}
        <View style={styles.voteColumn}>
          <TouchableOpacity 
            style={[styles.voteButton, { backgroundColor: theme.colors.backgroundSecondary }]}
            onPress={(e) => e.stopPropagation()}
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
            onPress={(e) => e.stopPropagation()}
          >
            <ArrowDown 
              size={18} 
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
                <View style={[styles.pinnedBadge, { backgroundColor: theme.colors.primary + '15' }]}>
                  <Pin size={12} color={theme.colors.primary} />
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
          
          <Text style={[styles.postTitle, { color: theme.colors.text }]} numberOfLines={3}>
            {post.title}
          </Text>
          
          <Text style={[styles.postContent, { color: theme.colors.textSecondary }]} numberOfLines={3}>
            {post.content}
          </Text>
          
          {/* Post Communities */}
          {post.communities.length > 0 && (
            <View style={styles.postCommunities}>
              {post.communities.slice(0, 3).map(communityId => {
                const community = communities.find(c => c.id === communityId);
                if (!community) return null;
                return (
                  <TouchableOpacity
                    key={communityId}
                    style={[styles.postCommunity, { backgroundColor: community.color + '15', borderColor: community.color + '30' }]}
                    onPress={() => toggleCommunity(communityId)}
                  >
                    <Text style={styles.communityIcon}>{community.icon}</Text>
                    <Text style={[styles.postCommunityText, { color: community.color }]}>
                      {community.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {post.communities.length > 3 && (
                <Text style={[styles.moreCommunities, { color: theme.colors.textTertiary }]}>
                  +{post.communities.length - 3}
                </Text>
              )}
            </View>
          )}
          
          {post.image && (
            <Image 
              source={{ uri: post.image }} 
              style={[styles.postImage, theme.shadow.small]} 
              resizeMode="cover"
            />
          )}
          
          <View style={styles.postActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                setSelectedPost(post);
                setShowComments(true);
              }}
            >
              <MessageCircle size={16} color={theme.colors.textTertiary} />
              <Text style={[styles.actionText, { color: theme.colors.textTertiary }]}>
                {post.comments.length}
              </Text>
            </TouchableOpacity>
            
            {post.awards && post.awards > 0 && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={(e) => e.stopPropagation()}
              >
                <Award size={16} color={theme.colors.warning} />
                <Text style={[styles.actionText, { color: theme.colors.textTertiary }]}>
                  {post.awards}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => e.stopPropagation()}
            >
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

  const toggleCommunity = (communityId: string) => {
    setSelectedCommunities(prev => 
      prev.includes(communityId) 
        ? prev.filter(c => c !== communityId)
        : [...prev, communityId]
    );
  };

  const renderCommunity = (community: Community) => {
    const isSelected = selectedCommunities.includes(community.id);
    const isMember = isJoined(community.id);
    
    return (
      <TouchableOpacity
        key={community.id}
        style={[
          styles.communityChip,
          {
            backgroundColor: isSelected ? community.color : (isMember ? community.color + '20' : theme.colors.card),
            borderColor: isSelected ? community.color : (isMember ? community.color : theme.colors.border),
            borderWidth: isMember ? 2 : 1.5,
          }
        ]}
        onPress={() => {
          if (isMember) {
            toggleCommunity(community.id);
          }
        }}
        onLongPress={() => {
          if (isMember) {
            leaveCommunity(community.id);
          } else {
            joinCommunity(community.id);
          }
        }}
      >
        <Text style={styles.communityChipIcon}>{community.icon}</Text>
        <View style={styles.communityChipContent}>
          <View style={styles.communityChipHeader}>
            <Text
              style={[
                styles.communityChipName,
                {
                  color: isSelected ? theme.colors.background : (isMember ? community.color : theme.colors.text),
                }
              ]}
            >
              {community.name}
            </Text>
            {isMember && (
              <View style={[styles.memberBadge, { backgroundColor: community.color }]}>
                <Text style={[styles.memberBadgeText, { color: theme.colors.background }]}>✓</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.communityChipMembers,
              {
                color: isSelected ? theme.colors.background + '80' : theme.colors.textTertiary,
              }
            ]}
          >
            {community.memberCount.toLocaleString()} members
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Explore</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textTertiary }]}>Discover Community discussions</Text>
        </View>
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: theme.colors.primary }, theme.shadow.small]}
          onPress={() => router.push('/create-post')}
        >
          <Plus size={20} color={theme.colors.background} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }, theme.shadow.small]}>
          <Search size={18} color={theme.colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search discussions, tags, users..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>



      <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
        {/* Communities Section - Now scrolls with content */}
        <View style={styles.scrollingCommunitiesSection}>
          <View style={styles.communitiesSectionHeader}>
            <View>
              <Text style={[styles.communitiesTitle, { color: theme.colors.text }]}>Communities</Text>
              <Text style={[styles.communitiesSubtitle, { color: theme.colors.textTertiary }]}>Join to post • Long press to join/leave</Text>
            </View>
            {selectedCommunities.length > 0 && (
              <TouchableOpacity 
                style={[styles.clearCommunitiesButton, { backgroundColor: theme.colors.error + '15' }]}
                onPress={() => setSelectedCommunities([])}
              >
                <X size={12} color={theme.colors.error} />
                <Text style={[styles.clearCommunitiesText, { color: theme.colors.error }]}>
                  Clear ({selectedCommunities.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.communitiesContainer}
          >
            {popularCommunities.map(renderCommunity)}
          </ScrollView>
        </View>

        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              { backgroundColor: sortBy === 'recent' ? theme.colors.primary : theme.colors.backgroundSecondary },
              theme.shadow.small
            ]}
            onPress={() => setSortBy('recent')}
          >
            <Clock 
              size={16} 
              color={sortBy === 'recent' ? theme.colors.background : theme.colors.textTertiary} 
            />
            <Text
              style={[
                styles.sortText,
                {
                  color: sortBy === 'recent' ? theme.colors.background : theme.colors.textTertiary,
                  fontWeight: sortBy === 'recent' ? '600' : '500',
                }
              ]}
            >
              Recent
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.sortButton,
              { backgroundColor: sortBy === 'nearme' ? theme.colors.primary : theme.colors.backgroundSecondary },
              theme.shadow.small
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
              color={sortBy === 'nearme' ? theme.colors.background : theme.colors.textTertiary} 
            />
            <Text
              style={[
                styles.sortText,
                {
                  color: sortBy === 'nearme' ? theme.colors.background : theme.colors.textTertiary,
                  fontWeight: sortBy === 'nearme' ? '600' : '500',
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
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 0,
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
    width: 260,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    minWidth: 80,
    justifyContent: 'center',
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
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'transparent',
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
    padding: 8,
    borderRadius: 8,
    minWidth: 32,
    alignItems: 'center',
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
  // Communities styles
  communitiesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scrollingCommunitiesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 16,
  },
  communitiesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  communitiesTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  communitiesSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  communitiesContainer: {
    paddingRight: 20,
    gap: 12,
  },
  communityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 12,
    minWidth: 140,
  },
  communityChipIcon: {
    fontSize: 20,
  },
  communityChipContent: {
    flex: 1,
  },
  communityChipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  communityChipName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  communityChipMembers: {
    fontSize: 11,
    fontWeight: '500',
  },
  clearCommunitiesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  clearCommunitiesText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Post communities styles
  postCommunities: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  postCommunity: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  communityIcon: {
    fontSize: 12,
  },
  postCommunityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreCommunities: {
    fontSize: 11,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  // New styles for improved UI
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  highlightMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  pinnedText: {
    fontSize: 11,
    fontWeight: '600',
  },

  sortScrollContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
});