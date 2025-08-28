import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

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
  images?: string[];
  awards?: number;
  tags: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
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
    tags: ['anxiety', 'medical', 'strains', 'cbd'],
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
    images: ['https://images.unsplash.com/photo-1603909223429-69bb7101f420?q=80&w=1000'],
    tags: ['dispensary', 'downtown', 'review', 'local'],
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
    tags: ['edibles', 'dosage', 'homemade', 'brownies', 'beginner'],
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
    images: ['https://images.unsplash.com/photo-1560999448-1be675dd1310?q=80&w=1000'],
    tags: ['vape', 'flower', 'comparison', 'vaporizer'],
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
    tags: ['growing', 'beginner', 'setup', 'tips'],
  },
];

const THREADS_STORAGE_KEY = 'forum_threads';

export const [ThreadsProvider, useThreads] = createContextHook(() => {
  const [posts, setPosts] = useState<ForumPost[]>(initialMockPosts);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load threads from storage on mount
  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      const stored = await AsyncStorage.getItem(THREADS_STORAGE_KEY);
      if (stored) {
        const storedThreads = JSON.parse(stored);
        // Merge stored threads with initial mock posts, avoiding duplicates
        const existingIds = new Set(initialMockPosts.map(post => post.id));
        const newThreads = storedThreads.filter((thread: ForumPost) => !existingIds.has(thread.id));
        setPosts([...newThreads, ...initialMockPosts]);
      }
    } catch (error) {
      console.error('Error loading threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThreads = async (threads: ForumPost[]) => {
    try {
      // Only save user-created threads (not the initial mock posts)
      const userThreads = threads.filter(thread => 
        !initialMockPosts.some(mockPost => mockPost.id === thread.id)
      );
      await AsyncStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(userThreads));
    } catch (error) {
      console.error('Error saving threads:', error);
    }
  };

  const addThread = async (threadData: Omit<ForumPost, 'id' | 'upvotes' | 'downvotes' | 'comments' | 'timestamp'>) => {
    const newThread: ForumPost = {
      ...threadData,
      id: Date.now().toString(),
      timestamp: 'now',
      upvotes: 0,
      downvotes: 0,
      comments: [],
    };

    const updatedPosts = [newThread, ...posts];
    setPosts(updatedPosts);
    await saveThreads(updatedPosts);
    
    console.log('Thread added successfully:', newThread);
    return newThread;
  };

  const updateThread = async (threadId: string, updates: Partial<ForumPost>) => {
    const updatedPosts = posts.map(post => 
      post.id === threadId ? { ...post, ...updates } : post
    );
    setPosts(updatedPosts);
    await saveThreads(updatedPosts);
  };

  const addComment = async (threadId: string, commentData: Omit<Comment, 'id' | 'upvotes' | 'downvotes' | 'timestamp'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `c${Date.now()}`,
      timestamp: 'now',
      upvotes: 0,
      downvotes: 0,
    };

    const updatedPosts = posts.map(post => 
      post.id === threadId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );
    setPosts(updatedPosts);
    await saveThreads(updatedPosts);
    
    return newComment;
  };

  const toggleVote = async (threadId: string, voteType: 'up' | 'down') => {
    const updatedPosts = posts.map(post => {
      if (post.id === threadId) {
        const isCurrentlyUpvoted = post.isUpvoted;
        const isCurrentlyDownvoted = post.isDownvoted;
        
        if (voteType === 'up') {
          if (isCurrentlyUpvoted) {
            // Remove upvote
            return { ...post, isUpvoted: false, upvotes: post.upvotes - 1 };
          } else {
            // Add upvote, remove downvote if exists
            return {
              ...post,
              isUpvoted: true,
              isDownvoted: false,
              upvotes: post.upvotes + 1,
              downvotes: isCurrentlyDownvoted ? post.downvotes - 1 : post.downvotes
            };
          }
        } else {
          if (isCurrentlyDownvoted) {
            // Remove downvote
            return { ...post, isDownvoted: false, downvotes: post.downvotes - 1 };
          } else {
            // Add downvote, remove upvote if exists
            return {
              ...post,
              isDownvoted: true,
              isUpvoted: false,
              downvotes: post.downvotes + 1,
              upvotes: isCurrentlyUpvoted ? post.upvotes - 1 : post.upvotes
            };
          }
        }
      }
      return post;
    });
    
    setPosts(updatedPosts);
    await saveThreads(updatedPosts);
  };

  const toggleBookmark = async (threadId: string) => {
    const updatedPosts = posts.map(post => 
      post.id === threadId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    );
    setPosts(updatedPosts);
    await saveThreads(updatedPosts);
  };

  const memoizedAddThread = useCallback(addThread, [posts]);
  const memoizedUpdateThread = useCallback(updateThread, [posts]);
  const memoizedAddComment = useCallback(addComment, [posts]);
  const memoizedToggleVote = useCallback(toggleVote, [posts]);
  const memoizedToggleBookmark = useCallback(toggleBookmark, [posts]);

  return useMemo(() => ({
    posts,
    isLoading,
    addThread: memoizedAddThread,
    updateThread: memoizedUpdateThread,
    addComment: memoizedAddComment,
    toggleVote: memoizedToggleVote,
    toggleBookmark: memoizedToggleBookmark,
  }), [posts, isLoading, memoizedAddThread, memoizedUpdateThread, memoizedAddComment, memoizedToggleVote, memoizedToggleBookmark]);
});

export type { ForumPost, Comment };