// src/pages/Community.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  Flag,
  MoreVertical,
  Search,
  Filter,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Loader,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Twitch,
  Sparkles,
  Zap,
  Award,
  Crown,
  Star,
  Flame,
  Trophy,
  Medal,
  Gem,
  Shield,
  Eye,
  EyeOff,
  Send,
  Image,
  Link,
  Smile,
  Paperclip,
  Mic,
  Video,
  PhoneCall,
  Users as UsersIcon,
  UserPlus as UserPlusIcon,
  MessageSquare,
  Bell,
  BellOff,
  Settings,
  LogOut,
  HelpCircle,
  Info,
  ThumbsUp,
  ThumbsDown,
  Share,
  Copy,
  ExternalLink,
  AtSign,
  Hash,
  Tag,
  Pin,
  PinOff,
  Edit2,
  Trash2,
  MoreHorizontal,
  Reply,
  Quote,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '../context/WebSocketContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const Community = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { socket, isConnected } = useWebSocket();
  const { profile } = useSelector(state => state.user || {});
  
  const [activeTab, setActiveTab] = useState('feed');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Posts state
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [commentingPostId, setCommentingPostId] = useState(null);
  
  // Friends state
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  
  // Notifications state - Initialize as empty array
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Create post state
  const [postContent, setPostContent] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [postPrivacy, setPostPrivacy] = useState('public');
  
  const fileInputRef = useRef(null);
  const postsEndRef = useRef(null);

  // Load initial data
  useEffect(() => {
    fetchCommunityData();
  }, []);

  // WebSocket connection
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on('new_post', (data) => {
      setPosts(prev => [data, ...prev]);
      toast.info(`New post from ${data.author?.displayName || 'Someone'}`);
    });

    socket.on('new_comment', (data) => {
      setComments(prev => ({
        ...prev,
        [data.postId]: [data, ...(prev[data.postId] || [])]
      }));
    });

    socket.on('new_like', (data) => {
      setPosts(prev => prev.map(post => 
        post.id === data.postId 
          ? { ...post, likes: (post.likes || 0) + 1, liked: true }
          : post
      ));
    });

    socket.on('new_notification', (data) => {
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.info(data.message || 'New notification');
    });

    socket.on('friend_request', (data) => {
      setFriendRequests(prev => [...prev, data]);
      toast.info(`${data.from?.displayName || 'Someone'} sent you a friend request`);
    });

    socket.on('friend_request_accepted', (data) => {
      setPendingRequests(prev => prev.filter(r => r.id !== data.requestId));
      setFriends(prev => [...prev, data.friend]);
      toast.success(`${data.friend?.displayName || 'Someone'} accepted your friend request!`);
    });

    return () => {
      socket.off('new_post');
      socket.off('new_comment');
      socket.off('new_like');
      socket.off('new_notification');
      socket.off('friend_request');
      socket.off('friend_request_accepted');
    };
  }, [socket, isConnected]);

  const fetchCommunityData = async () => {
    setIsLoading(true);
    try {
      // Fetch posts
      const postsResponse = await fetch('/api/community/posts');
      const postsData = await postsResponse.json();
      setPosts(Array.isArray(postsData) ? postsData : postsData.posts || []);

      // Fetch friends
      const friendsResponse = await fetch('/api/community/friends');
      const friendsData = await friendsResponse.json();
      setFriends(Array.isArray(friendsData) ? friendsData : []);

      // Fetch friend requests
      const requestsResponse = await fetch('/api/community/friend-requests');
      const requestsData = await requestsResponse.json();
      setFriendRequests(Array.isArray(requestsData?.incoming) ? requestsData.incoming : []);
      setPendingRequests(Array.isArray(requestsData?.outgoing) ? requestsData.outgoing : []);

      // Fetch suggested friends
      const suggestedResponse = await fetch('/api/community/suggested-friends');
      const suggestedData = await suggestedResponse.json();
      setSuggestedFriends(Array.isArray(suggestedData) ? suggestedData : []);

      // Fetch notifications - FIX: Ensure we're getting an array
      const notificationsResponse = await fetch('/api/community/notifications');
      const notificationsData = await notificationsResponse.json();
      
      // SAFETY CHECK: Ensure notificationsData is an array
      let notificationsArray = [];
      if (Array.isArray(notificationsData)) {
        notificationsArray = notificationsData;
      } else if (notificationsData?.notifications && Array.isArray(notificationsData.notifications)) {
        notificationsArray = notificationsData.notifications;
      } else {
        notificationsArray = [];
        console.warn('Notifications data is not an array:', notificationsData);
      }
      
      setNotifications(notificationsArray);
      setUnreadCount(notificationsArray.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching community data:', error);
      toast.error('Failed to load community data');
      // Set empty arrays on error
      setNotifications([]);
      setPosts([]);
      setFriends([]);
      setFriendRequests([]);
      setPendingRequests([]);
      setSuggestedFriends([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && postImages.length === 0) {
      toast.error('Please add some content to your post');
      return;
    }

    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: postContent,
          images: postImages,
          privacy: postPrivacy,
        }),
      });
      const newPost = await response.json();
      setPosts(prev => [newPost, ...prev]);
      setPostContent('');
      setPostImages([]);
      setShowCreatePost(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
      setPosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, likes: (post.likes || 0) + 1, liked: true }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      const comment = await response.json();
      setComments(prev => ({
        ...prev,
        [postId]: [comment, ...(prev[postId] || [])]
      }));
      setNewComment('');
      setCommentingPostId(null);
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleFriendRequest = async (userId, action) => {
    try {
      await fetch(`/api/community/friend-requests/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (action === 'accept') {
        setFriendRequests(prev => prev.filter(r => r.from?.id !== userId));
        const friend = friendRequests.find(r => r.from?.id === userId);
        if (friend?.from) {
          setFriends(prev => [...prev, friend.from]);
        }
        toast.success('Friend request accepted!');
      } else if (action === 'reject') {
        setFriendRequests(prev => prev.filter(r => r.from?.id !== userId));
        toast.info('Friend request rejected');
      } else if (action === 'send') {
        setPendingRequests(prev => [...prev, { to: { id: userId } }]);
        setSuggestedFriends(prev => prev.filter(f => f.id !== userId));
        toast.success('Friend request sent!');
      } else if (action === 'cancel') {
        setPendingRequests(prev => prev.filter(r => r.to?.id !== userId));
        toast.info('Friend request cancelled');
      }
    } catch (error) {
      console.error('Error handling friend request:', error);
      toast.error('Failed to process friend request');
    }
  };

  const handleShare = async (postId) => {
    try {
      await fetch(`/api/community/posts/${postId}/share`, { method: 'POST' });
      toast.success('Post shared!');
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      await fetch(`/api/community/posts/${postId}/bookmark`, { method: 'POST' });
      setPosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, bookmarked: !post.bookmarked }
          : post
      ));
      const post = posts.find(p => p.id === postId);
      toast.success(post?.bookmarked ? 'Bookmark removed' : 'Bookmarked!');
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  const handleReport = async (postId) => {
    try {
      await fetch(`/api/community/posts/${postId}/report`, { method: 'POST' });
      toast.success('Post reported. We\'ll review it shortly.');
    } catch (error) {
      console.error('Error reporting post:', error);
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      await fetch('/api/community/notifications/mark-read', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications read:', error);
    }
  };

  const tabs = [
    { id: 'feed', label: 'Feed', icon: MessageCircle },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'suggested', label: 'Suggested', icon: UserPlus },
  ];

  if (isLoading && posts.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Community</h1>
          <p className="text-gray-400">Connect, share, and grow with others</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreatePost(true)}
          >
            Create Post
          </Button>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium transition border-b-2 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'text-primary-400 border-primary-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'notifications' && unreadCount > 0 && (
                  <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'feed' && (
              <FeedTab
                posts={posts}
                comments={comments}
                newComment={newComment}
                setNewComment={setNewComment}
                commentingPostId={commentingPostId}
                setCommentingPostId={setCommentingPostId}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onBookmark={handleBookmark}
                onReport={handleReport}
                onPostClick={(post) => {
                  setSelectedPost(post);
                  setShowPostDetail(true);
                }}
              />
            )}
            {activeTab === 'friends' && (
              <FriendsTab
                friends={friends}
                friendRequests={friendRequests}
                pendingRequests={pendingRequests}
                onAccept={(userId) => handleFriendRequest(userId, 'accept')}
                onReject={(userId) => handleFriendRequest(userId, 'reject')}
                onCancel={(userId) => handleFriendRequest(userId, 'cancel')}
              />
            )}
            {activeTab === 'notifications' && (
              <NotificationsTab
                notifications={notifications}
                onMarkRead={handleMarkNotificationsRead}
              />
            )}
            {activeTab === 'suggested' && (
              <SuggestedTab
                suggestedFriends={suggestedFriends}
                onSendRequest={(userId) => handleFriendRequest(userId, 'send')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <CreatePostModal
            content={postContent}
            setContent={setPostContent}
            images={postImages}
            setImages={setPostImages}
            privacy={postPrivacy}
            setPrivacy={setPostPrivacy}
            onClose={() => setShowCreatePost(false)}
            onSubmit={handleCreatePost}
            fileInputRef={fileInputRef}
          />
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {showPostDetail && selectedPost && (
          <PostDetailModal
            post={selectedPost}
            comments={comments[selectedPost.id] || []}
            onClose={() => {
              setShowPostDetail(false);
              setSelectedPost(null);
            }}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onBookmark={handleBookmark}
            onReport={handleReport}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// Sub-Components
// ============================================

// Feed Tab
const FeedTab = ({
  posts,
  comments,
  newComment,
  setNewComment,
  commentingPostId,
  setCommentingPostId,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onReport,
  onPostClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Ensure posts is an array
  const postsArray = Array.isArray(posts) ? posts : [];

  const filteredPosts = postsArray.filter(post => {
    if (!post) return false;
    const matchesSearch = (post.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (post.author?.displayName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || post.privacy === filter;
    return matchesSearch && matchesFilter;
  });

  const getPrivacyIcon = (privacy) => {
    const icons = {
      public: Globe,
      friends: Users,
      private: Lock,
    };
    return icons[privacy] || Globe;
  };

  const getPrivacyLabel = (privacy) => {
    const labels = {
      public: 'Public',
      friends: 'Friends Only',
      private: 'Private',
    };
    return labels[privacy] || 'Public';
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'public', 'friends'].map((privacy) => (
              <button
                key={privacy}
                onClick={() => setFilter(privacy)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  filter === privacy
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {privacy.charAt(0).toUpperCase() + privacy.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <div className="glass-effect rounded-xl p-12 text-center border border-white/20">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white">No posts yet</h3>
          <p className="text-gray-400">Be the first to share something with the community!</p>
          <Button className="mt-4" variant="gradient" icon={Plus}>
            Create Post
          </Button>
        </div>
      ) : (
        filteredPosts.map((post, index) => {
          if (!post) return null;
          
          const PrivacyIcon = getPrivacyIcon(post.privacy);
          const postComments = comments[post.id] || [];
          
          return (
            <motion.div
              key={post.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-effect rounded-xl p-4 border border-white/20 hover:border-white/30 transition"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {post.author?.displayName?.[0] || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {post.author?.displayName || 'Unknown User'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <PrivacyIcon className="w-3 h-3" />
                        {getPrivacyLabel(post.privacy)}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white transition">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Post Content */}
              <div 
                className="mt-3 cursor-pointer"
                onClick={() => onPostClick(post)}
              >
                <p className="text-gray-300 whitespace-pre-wrap">{post.content || ''}</p>
                {post.images && post.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {post.images.map((image, i) => (
                      <div key={i} className="rounded-lg overflow-hidden bg-white/5">
                        <img src={image} alt={`Post image ${i + 1}`} className="w-full h-32 object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="mt-3 flex items-center gap-6 pt-3 border-t border-white/10">
                <button
                  onClick={() => onLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm transition ${
                    post.liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-400' : ''}`} />
                  <span>{post.likes || 0}</span>
                </button>
                <button
                  onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{postComments.length}</span>
                </button>
                <button
                  onClick={() => onShare(post.id)}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{post.shares || 0}</span>
                </button>
                <button
                  onClick={() => onBookmark(post.id)}
                  className={`text-sm transition ml-auto ${
                    post.bookmarked ? 'text-primary-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${post.bookmarked ? 'fill-primary-400' : ''}`} />
                </button>
                <button
                  onClick={() => onReport(post.id)}
                  className="text-sm text-gray-400 hover:text-red-400 transition"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>

              {/* Comments Section */}
              {commentingPostId === post.id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          onComment(post.id);
                        }
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => onComment(post.id)}
                      disabled={!newComment.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  {postComments.length > 0 && (
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                      {postComments.slice(0, 3).map((comment, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="font-medium text-white">
                            {comment.author?.displayName || 'Unknown'}
                          </span>
                          <span className="text-gray-300">{comment.content || ''}</span>
                          <span className="text-xs text-gray-400 ml-auto">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      ))}
                      {postComments.length > 3 && (
                        <button
                          onClick={() => onPostClick(post)}
                          className="text-xs text-primary-400 hover:text-primary-300"
                        >
                          View all {postComments.length} comments
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
};

// Friends Tab
const FriendsTab = ({ friends, friendRequests, pendingRequests, onAccept, onReject, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const friendsArray = Array.isArray(friends) ? friends : [];
  const friendRequestsArray = Array.isArray(friendRequests) ? friendRequests : [];
  const pendingRequestsArray = Array.isArray(pendingRequests) ? pendingRequests : [];

  const filteredFriends = friendsArray.filter(friend =>
    (friend?.displayName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Friend Requests */}
      {friendRequestsArray.length > 0 && (
        <div className="glass-effect rounded-xl p-4 border border-white/20">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary-400" />
            Friend Requests ({friendRequestsArray.length})
          </h3>
          <div className="space-y-2">
            {friendRequestsArray.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {request.from?.displayName?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-white">{request.from?.displayName || 'Unknown User'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAccept(request.from?.id)}
                    className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onReject(request.from?.id)}
                    className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-400" />
            Friends ({friendsArray.length})
          </h3>
          <Input
            icon={Search}
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {filteredFriends.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p>No friends found</p>
            {searchTerm && <p className="text-sm">Try adjusting your search</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFriends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {friend.displayName?.[0] || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{friend.displayName || 'Unknown User'}</p>
                  <p className="text-xs text-gray-400">{friend.careerPath || 'General'}</p>
                </div>
                <button className="p-1.5 text-gray-400 hover:text-white transition">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Requests */}
      {pendingRequestsArray.length > 0 && (
        <div className="glass-effect rounded-xl p-4 border border-white/20">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            Pending Requests
          </h3>
          <div className="space-y-2">
            {pendingRequestsArray.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-400">
                      {request.to?.displayName?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{request.to?.displayName || 'Unknown User'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-yellow-400">Pending</span>
                  <button
                    onClick={() => onCancel(request.to?.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Notifications Tab
const NotificationsTab = ({ notifications, onMarkRead }) => {
  // Ensure notifications is an array
  const notificationsArray = Array.isArray(notifications) ? notifications : [];

  const getNotificationIcon = (type) => {
    const icons = {
      like: Heart,
      comment: MessageCircle,
      friend_request: UserPlus,
      friend_accept: UserCheck,
      mention: AtSign,
      share: Share2,
      post: MessageCircle,
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      like: 'text-red-400',
      comment: 'text-blue-400',
      friend_request: 'text-green-400',
      friend_accept: 'text-green-400',
      mention: 'text-purple-400',
      share: 'text-cyan-400',
      post: 'text-primary-400',
    };
    return colors[type] || 'text-gray-400';
  };

  return (
    <div className="glass-effect rounded-xl border border-white/20 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Notifications</h3>
        {notificationsArray.some(n => !n.read) && (
          <button
            onClick={onMarkRead}
            className="text-xs text-primary-400 hover:text-primary-300 transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {notificationsArray.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-500" />
            <p>No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          notificationsArray.map((notification, index) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <motion.div
                key={notification.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`
                  flex items-start gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition
                  ${!notification.read ? 'bg-primary-500/5' : ''}
                `}
              >
                <div className={`p-2 rounded-lg ${!notification.read ? 'bg-primary-500/20' : 'bg-white/5'}`}>
                  <Icon className={`w-4 h-4 ${getNotificationColor(notification.type)}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{notification.message || 'New notification'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0 mt-2" />
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

// Suggested Tab
const SuggestedTab = ({ suggestedFriends, onSendRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const suggestedArray = Array.isArray(suggestedFriends) ? suggestedFriends : [];

  const filteredSuggestions = suggestedArray.filter(friend =>
    (friend?.displayName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary-400" />
            People You May Know
          </h3>
          <Input
            icon={Search}
            placeholder="Search people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </div>

      {filteredSuggestions.length === 0 ? (
        <div className="glass-effect rounded-xl p-12 text-center border border-white/20">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white">No suggestions</h3>
          <p className="text-gray-400">Check back later for new people to connect with</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuggestions.map((friend) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 }}
              className="glass-effect rounded-xl p-4 border border-white/20 hover:border-white/30 transition text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-white">
                  {friend.displayName?.[0] || 'U'}
                </span>
              </div>
              <p className="text-sm font-medium text-white">{friend.displayName || 'Unknown User'}</p>
              <p className="text-xs text-gray-400">{friend.careerPath || 'General'}</p>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-400">
                <span>{friend.mutualFriends || 0} mutual friends</span>
              </div>
              <Button
                variant="gradient"
                size="small"
                className="mt-3 w-full"
                icon={UserPlus}
                onClick={() => onSendRequest(friend.id)}
              >
                Connect
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Create Post Modal
const CreatePostModal = ({
  content,
  setContent,
  images,
  setImages,
  privacy,
  setPrivacy,
  onClose,
  onSubmit,
  fileInputRef,
}) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...imageUrls]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-xl max-w-lg w-full border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Create Post</h3>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Privacy Selector */}
            <div className="flex gap-2">
              {['public', 'friends', 'private'].map((option) => (
                <button
                  key={option}
                  onClick={() => setPrivacy(option)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    privacy === option
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>

            {/* Content */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-white/5 rounded-lg px-4 py-3 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows="4"
            />

            {/* Image Upload */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <Image className="w-4 h-4" />
                Add Images
              </button>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-0.5 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button variant="gradient" className="flex-1" onClick={onSubmit}>
                Post
              </Button>
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Post Detail Modal (simplified version)
const PostDetailModal = ({
  post,
  comments,
  onClose,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onReport,
}) => {
  const [newComment, setNewComment] = useState('');

  if (!post) return null;

  const handleComment = () => {
    if (!newComment.trim()) return;
    onComment(post.id, newComment);
    setNewComment('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {post.author?.displayName?.[0] || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {post.author?.displayName || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-400">
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-gray-300 whitespace-pre-wrap">{post.content || ''}</p>
            {post.images && post.images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {post.images.map((image, i) => (
                  <div key={i} className="rounded-lg overflow-hidden bg-white/5">
                    <img src={image} alt={`Post image ${i + 1}`} className="w-full h-48 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 pb-4 border-b border-white/10">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-1.5 text-sm transition ${
                post.liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-400' : ''}`} />
              <span>{post.likes || 0}</span>
            </button>
            <button
              onClick={() => onShare(post.id)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition"
            >
              <Share2 className="w-4 h-4" />
              <span>{post.shares || 0}</span>
            </button>
            <button
              onClick={() => onBookmark(post.id)}
              className={`text-sm transition ml-auto ${
                post.bookmarked ? 'text-primary-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${post.bookmarked ? 'fill-primary-400' : ''}`} />
            </button>
            <button
              onClick={() => onReport(post.id)}
              className="text-sm text-gray-400 hover:text-red-400 transition"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>

          {/* Comments */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-white mb-3">
              Comments ({comments?.length || 0})
            </h4>

            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleComment();
                  }
                }}
              />
              <Button size="small" onClick={handleComment} disabled={!newComment.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {!comments || comments.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No comments yet</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-white/5 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">
                        {comment.author?.displayName?.[0] || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-white">
                          {comment.author?.displayName || 'Unknown'}
                        </span>
                        <span className="text-gray-300 ml-1">{comment.content || ''}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 w-48 bg-white/5 rounded"></div>
        <div className="h-4 w-64 bg-white/5 rounded mt-2"></div>
      </div>
      <div className="h-10 w-32 bg-white/5 rounded"></div>
    </div>
    <div className="h-12 bg-white/5 rounded-xl"></div>
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-48 bg-white/5 rounded-xl"></div>
      ))}
    </div>
  </div>
);

export default Community;