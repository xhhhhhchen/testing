// Displays paginated list of discussion threads

import React from 'react';
import type { Post } from '../../types/variables';
import { Link } from 'react-router-dom'; // Changed from next/link
import LikeButton from './Likebutton.tsx';
import UserAvatar from '../../ui/userAvatar';

interface PostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const PostList: React.FC<PostListProps> = ({ posts, loading, error }) => {
  if (loading) return <div className="text-center py-8">Loading posts...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!posts.length) return <div className="text-center py-8">No posts found</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.post_id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start space-x-4">
            <UserAvatar userId={post.user_id} username={post.user?.username || ''} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Link 
                  to={`/posts/${post.post_id}`} // Changed from href to to
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                >
                  {post.title}
                </Link>
                <span className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{post.user?.username}</p>
              <div className="flex space-x-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {post.topic}
                </span>
                {post.sub_topic && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {post.sub_topic}
                  </span>
                )}
              </div>
              <p className="mt-2 text-gray-700 line-clamp-3">{post.content}</p>
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <LikeButton postId={post.post_id} initialLikes={post.likes_count || 0} />
                <span>
                  {post.comments_count || 0} comment{post.comments_count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;