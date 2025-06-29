// Individual post detail view
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../supabaseClient';
import type { Post } from '../types/variables';
import PostDetail from '../components/forum/PostDetails';
import { useUser } from '../contexts/UserContext';

const PostPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('posts')
          .select('*, user:users(*)')
          .eq('post_id', id)
          .single();

        if (supabaseError) throw supabaseError;

        // Get likes and comments count
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact' })
          .eq('post_id', id);

        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact' })
          .eq('post_id', id);

        setPost({
          ...data,
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading post...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!post) return <div className="text-center py-8">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PostDetail post={post} currentUserId={user?.user_id || 0} />
    </div>
  );
};

export default PostPage;