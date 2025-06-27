import React, { useState } from 'react';
import type { Post } from '../../types/variables';
import { Link } from 'react-router-dom';
import LikeButton from './Likebutton';
import UserAvatar from '../../ui/userAvatar';
import { formatDistanceToNow, isBefore, subDays, format } from 'date-fns';
import CreateComment from './CreateComment';
import CommentList from './CommentList';
import { useUser } from '../../contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const PostList: React.FC<PostListProps> = ({ posts, loading, error }) => {
  const { user } = useUser();
  const [activeCommentForm, setActiveCommentForm] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeComments, setActiveComments] = useState<number | null>(null);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const toggleComments = (postId: number) =>
    setActiveComments(prev => (prev === postId ? null : postId));

  const toggleCommentForm = (postId: number) =>
    setActiveCommentForm(prev => (prev === postId ? null : postId));

  if (loading) return <div className="text-center py-8">Loading posts...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!posts.length) return <div className="text-center py-8">No posts found</div>;

  const topicIcons: Record<string, string> = {
    'Composting': '♻️',
    'Plants': '🪴',
    'Tank Maintenance': '🛠️',
    'Community': '👥',
  };

  const topicStyles: Record<string, string> = {
    'Composting': 'bg-amber-100 text-amber-800',
    'Plants': 'bg-emerald-100 text-emerald-800',
    'Tank Maintenance': 'bg-gray-200 text-gray-800',
    'Community': 'bg-pink-100 text-pink-800',
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const postDate = new Date(post.created_at);
        const oneDayAgo = subDays(new Date(), 1);
        const displayDate = isBefore(postDate, oneDayAgo)
          ? format(postDate, 'MMM d, yyyy')
          : formatDistanceToNow(postDate, { addSuffix: true });

        const isCommentSectionActive = activeComments === post.post_id;
        const isFormActive = activeCommentForm === post.post_id;

        return (
          <div key={post.post_id} className="rounded-lg shadow-lg p-6">
            <div className="flex items-start space-x-4">
              <UserAvatar userId={post.user?.user_id} username={post.user?.username || ''} />

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/posts/${post.post_id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {post.title}
                    </Link>

                    {post.user && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="font-medium">{post.user.username}</span>
                        <span className="w-1 h-1 bg-gray-500 rounded-full" />
                        <span className="text-gray-500">
                          {post.user.location?.location_name || 'Unknown Location'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    {post.topic && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          topicStyles[post.topic] || 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <span className="mr-1">{topicIcons[post.topic] || ''}</span>
                        {post.topic}
                      </span>
                    )}
                    {post.sub_topic && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          topicStyles[post.sub_topic] || 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <span className="mr-1">{topicIcons[post.sub_topic] || ''}</span>
                        {post.sub_topic}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs text-gray-500 mt-1 block">{displayDate}</span>
                <p className="mt-2 text-gray-700">{post.content}</p>

                {/* Like + Comment Toggle */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <LikeButton postId={post.post_id} initialLikes={post.likes_count || 0} />
                    <span>
                      {post.comments_count || 0} comment{post.comments_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleComments(post.post_id)}
                    className="text-sm text-green-900/70 hover:text-green-800 hover:underline cursor-pointer transition-colors duration-200"
                  >
                    {isCommentSectionActive ? 'Hide Comments' : 'View Comments'}
                  </button>
                </div>

                {/* Animated Comments Section */}
                <AnimatePresence>
                  {isCommentSectionActive && (
                    <motion.div
                      key={post.post_id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4 border-t border-gray-200 pt-4"
                    >
                      <CommentList key={refreshKey} postId={post.post_id} />
                      <div className="mt-4">
                        <button
                          onClick={() => toggleCommentForm(post.post_id)}
                          className="text-sm text-green-700 hover:text-green-800 hover:underline cursor-pointer transition-colors duration-200"
                        >
                          {isFormActive ? 'Cancel Reply' : 'Reply'}
                        </button>
                        {isFormActive && user?.user_id && (
                          <div className="mt-4">
                            <CreateComment
                              postId={post.post_id}
                              userId={user.user_id}
                              onCommentAdded={triggerRefresh}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
