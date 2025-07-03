import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../hooks/usePosts';
import PostList from '../components/forum/PostList';
import CreatePost from '../components/forum/CreatePost';
import { FiPlus, FiSearch, FiClock, FiTrendingUp } from 'react-icons/fi';

const ForumPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const topic = searchParams.get('topic') || undefined;
  const subTopic = searchParams.get('sub_topic') || undefined;
  const { posts, loading, error, createPost, refetchPosts } = usePosts(topic, subTopic);


  const sortedPosts = useMemo(() => {
    if (!posts) return [];

    const filtered = searchQuery
      ? posts.filter(
          post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.sub_topic && post.sub_topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : posts;

    return [...filtered].sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.likes_count || 0) - (a.likes_count || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [posts, searchQuery, sortBy]);

  if (!user) {
    return <div className="p-8 text-center">Please log in to access the forum</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center ">
      {/* Sticky Top Bar - now matches the width of the main content */}
      <div className="sticky  top-0 z-30 w-full mt-2 bg-white backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="w-full flex justify-center">
          <div className="w-4/5 max-w-screen-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Sort Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('recent')}
                className={`flex items-center px-3 py-1.5 cursor-pointer rounded-3xl text-sm border ${
                  sortBy === 'recent'
                    ? 'bg-green-100 text-green-700 font-medium border-green-400'
                    : 'text-gray-600 hover:bg-gray-100 border-gray-300'
                }`}
              >
                <FiClock className="mr-1.5" />
                Recent
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`flex items-center px-3 py-1.5 text-sm cursor-pointer rounded-3xl border ${
                  sortBy === 'popular'
                    ? 'bg-green-100 text-green-700 font-medium border-green-400'
                    : 'text-gray-600 hover:bg-gray-100 border-gray-300'
                }`}
              >
                <FiTrendingUp className="mr-1.5" />
                Popular
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-9 pr-3 py-1.5 bg-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-700/40 focus:bg-gray-100 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* New Post Button */}
            <button
              onClick={() => (document.getElementById('create-post-modal') as HTMLDialogElement)?.showModal()}
              className="flex items-center px-3 py-1.5 bg-green-800 text-white rounded-md cursor-pointer hover:bg-green-700 text-sm whitespace-nowrap"
            >
              <FiPlus className="mr-1.5" />
              New Post
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-4/5 max-w-screen-xl flex-1 py-6 space-y-6">
        <PostList posts={sortedPosts} loading={loading} error={error} />
      </main>



      {/* Create Post Modal */}
      
      <dialog id="create-post-modal" className="modal fixed inset-0 z-50 rounded-2xl max-w-2xl w-full justify-center ">
        <div className="modal-box rounded-lg max-w-2xl w-full">
         <CreatePost userId={user.user_id} onPostCreated={refetchPosts} />

        </div>
      </dialog>


    </div>
  );
};

export default ForumPage;