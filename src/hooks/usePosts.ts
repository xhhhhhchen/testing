import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Post } from '../types/variables';

export const usePosts = (topic?: string, subTopic?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('posts')
        .select(`
          *,
          user:users (
            user_id,
            username,
            location:location_id (
              location_id,
              location_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (topic) {
        query = query.eq('topic', topic);
      }

      if (subTopic) {
        query = query.eq('sub_topic', subTopic);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      const postsWithCounts = await Promise.all(
        (data as Post[]).map(async (post) => {
          const { count: likesCount } = await supabase
            .from('likes')
            .select('*', { count: 'exact' })
            .eq('post_id', post.post_id);

          const { count: commentsCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact' })
            .eq('post_id', post.post_id);

          return {
            ...post,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [topic, subTopic]);

  const createPost = async (post: Omit<Post, 'post_id' | 'created_at' | 'user'>) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select(`
          *,
          user:users (
            user_id,
            username,
            location:location_id (
              location_id,
              location_name
            )
          )
        `)
        .single();

      if (error) throw error;

      // Optionally prepend newly created post
      setPosts((prev) => [{ ...data, likes_count: 0, comments_count: 0 }, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      throw err;
    }
  };

  return { posts, loading, error, createPost, refetchPosts: fetchPosts };
};
