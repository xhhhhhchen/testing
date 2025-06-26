// interactive like functionality

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

interface LikeButtonProps {
  postId?: number;
  commentId?: number;
  initialLikes: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, commentId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('user_id')
          .eq('auth_uid', user.id)
          .single();
        
        if (data) setUserId(data.user_id);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!userId) return;

      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq(postId ? 'post_id' : 'comment_id', postId || commentId);

      setIsLiked((count || 0) > 0);
    };

    checkIfLiked();
  }, [userId, postId, commentId]);

  const handleLike = async () => {
    if (!userId) return;

    if (isLiked) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq(postId ? 'post_id' : 'comment_id', postId || commentId);

      if (!error) {
        setLikes(likes - 1);
        setIsLiked(false);
      }
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: userId,
          ...(postId ? { post_id: postId } : { comment_id: commentId }),
        });

      if (!error) {
        setLikes(likes + 1);
        setIsLiked(true);
      }
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-1 ${isLiked ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`}
      disabled={!userId}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill={isLiked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{likes}</span>
    </button>
  );
};

export default LikeButton;