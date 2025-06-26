// Handles comment operations

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Comment } from '../types/variables';

export const useComments = (postId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('comments')
          .select('*, user:users(*)')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (supabaseError) throw supabaseError;

        // Get likes count for each comment
        const commentsWithCounts = await Promise.all(
          (data as Comment[]).map(async (comment) => {
            const { count } = await supabase
              .from('likes')
              .select('*', { count: 'exact' })
              .eq('comment_id', comment.comment_id);

            return {
              ...comment,
              likes_count: count || 0,
            };
          })
        );

        setComments(commentsWithCounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchComments();
  }, [postId]);

  const createComment = async (comment: Omit<Comment, 'comment_id' | 'created_at' | 'user'>) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select('*, user:users(*)')
        .single();

      if (error) throw error;

      setComments((prev) => [...prev, { ...data, likes_count: 0 }]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
      throw err;
    }
  };

  return { comments, loading, error, createComment };
};