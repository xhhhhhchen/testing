// comment creation form 

import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import UserAvatar from '../../ui/userAvatar';
import { useUser } from '../../contexts/UserContext';

interface CreateCommentProps {
  postId: number;
  userId: number;
  onCommentAdded?: () => void;
}

const CreateComment: React.FC<CreateCommentProps> = ({ postId, userId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content,
        });

      if (error) throw error;

      setContent('');
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

return (
  <div className="mt-6">
    <div className="flex space-x-3">
      <UserAvatar userId={userId} username={user?.username || ''} />
      <div className="flex-1">
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

          <div className="border border-green-900/20 rounded-lg shadow-sm overflow-hidden">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={3}
              id="comment"
              className="block w-full py-3 px-4 border border-gray-200 resize-none rounded-md focus:ring-2 focus:ring-green-600/30 focus:outline-none sm:text-sm focus:bg-gray-50 placeholder-green-900/40 text-green-900"
              placeholder="Add your comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className=" px-4 py-3 text-right">
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm cursor-pointer text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
);

};

export default CreateComment;