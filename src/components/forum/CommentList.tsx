// renders nested commnets 

import React from 'react';
import type { Comment } from '../../types/variables';
import LikeButton from './Likebutton';
import UserAvatar from '../../ui/userAvatar';
import { useComments } from '../../hooks/useComments';

interface CommentListProps {
  postId: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const { comments, loading, error } = useComments(postId);

  if (loading) return <div className="text-center py-4">Loading comments...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!comments.length) return <div className="text-center py-4">No comments yet</div>;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.comment_id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <UserAvatar userId={comment.user_id} username={comment.user?.username || ''} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {comment.user?.username}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
              <div className="mt-2">
                <LikeButton
                  commentId={comment.comment_id}
                  initialLikes={comment.likes_count || 0}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;