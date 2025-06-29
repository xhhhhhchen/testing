// renders nested commnets 

import React from 'react';
import LikeButton from './Likebutton';
import UserAvatar from '../../ui/userAvatar';
import { useComments } from '../../hooks/useComments';
import { formatDistanceToNow, isBefore, subDays, format } from 'date-fns';
interface CommentListProps {
  postId: number;
}
const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const { comments, loading, error } = useComments(postId);

  if (loading) return <div className="text-center py-4 text-gray-400">Loading comments...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!comments.length) return <div className="text-center py-4 text-gray-400">No comments yet</div>;

  // Sort comments by created_at ascending (oldest first)
  const sortedComments = [...comments].sort(
    (b, a) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedComments.map((comment) => {
        const postDate = new Date(comment.created_at);
        const oneDayAgo = subDays(new Date(), 1);
        const displayDate = isBefore(postDate, oneDayAgo)
          ? format(postDate, 'MMM d, yyyy')
          : formatDistanceToNow(postDate, { addSuffix: true });

        return (
          <div key={comment.comment_id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <UserAvatar userId={comment.user_id} username={comment.user?.username || ''} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.user?.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {displayDate}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                <div className="mt-2 text-sm">
                  <LikeButton
                    commentId={comment.comment_id}
                    initialLikes={comment.likes_count || 0}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;