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
            <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden">
              <label htmlFor="comment" className="sr-only">
                Add your comment
              </label>
              <textarea
                rows={3}
                id="comment"
                className="block w-full py-3 px-4 border-0 resize-none focus:ring-0 sm:text-sm"
                placeholder="Add your comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="bg-gray-50 px-4 py-3 text-right">
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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