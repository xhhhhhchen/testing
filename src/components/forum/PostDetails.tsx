import React from 'react';
import type { Post } from '../../types/variables';
import LikeButton from './Likebutton';
import UserAvatar from '../../ui/userAvatar';
import CommentList from './CommentList';
import CreateComment from './CreateComment';

interface PostDetailProps {
  post: Post;
  currentUserId: number;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, currentUserId }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start space-x-4">
        <UserAvatar userId={post.user?.user_id} username={post.user?.username || ''} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
            <span className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">by {post.user?.username}</p>
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
          <div className="mt-4 prose max-w-none text-gray-700">
            {post.content}
          </div>
          <div className="mt-6 flex items-center space-x-4 text-sm text-gray-500">
            <LikeButton postId={post.post_id} initialLikes={post.likes_count || 0} />
            <span>
              {post.comments_count || 0} comment{post.comments_count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
        <CommentList postId={post.post_id} />
        {currentUserId && <CreateComment postId={post.post_id} userId={currentUserId} />}
      </div>
    </div>
  );
};

export default PostDetail;