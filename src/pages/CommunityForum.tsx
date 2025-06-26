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

  const { posts, loading, error } = usePosts(topic, subTopic);

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

  const handleTabChange = (tabId: string) => {
    if (tabId === 'all') {
      navigate('/community');
    } else {
      navigate(`/community?topic=${encodeURIComponent(tabId)}`);
    }
  };

  return (
<div className="min-h-screen flex flex-col items-center bg-gray-50 overflow-auto">



          {/* Main Content - Scrollable */}
    <main className="flex-1  w-4/5 max-w-screen-xl justify-center overflow-auto p-6 space-y-6">

      
      {/* Top bar with search, sort, and new post */}
      <div className="flex flex-col justify-center md:flex-row md:items-center md:justify-between gap-4">

        {/* Sort Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('recent')}
            className={`flex items-center px-4 py-2 text-sm rounded-md border ${
              sortBy === 'recent'
                ? 'bg-blue-100 text-blue-700 border-blue-400'
                : 'text-gray-600 hover:bg-gray-100 border-gray-300'
            }`}
          >
            <FiClock className="mr-2" />
            Most Recent
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`flex items-center px-4 py-2 text-sm rounded-md border ${
              sortBy === 'popular'
                ? 'bg-blue-100 text-blue-700 border-blue-400'
                : 'text-gray-600 hover:bg-gray-100 border-gray-300'
            }`}
          >
            <FiTrendingUp className="mr-2" />
            Most Popular
          </button>
        </div>


        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* New Post Button */}
        <button
          onClick={() => (document.getElementById('create-post-modal') as HTMLDialogElement)?.showModal()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          New Post
        </button>
      </div>

      {/* Post List */}
      <PostList posts={sortedPosts} loading={loading} error={error} />
    </main>


          {/* Create Post Modal */}
          <dialog id="create-post-modal" className="modal">
            <div className="modal-box">
              <CreatePost userId={user.user_id} />
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => (document.getElementById('create-post-modal') as HTMLDialogElement)?.close()}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        </div>
      );
    };

export default ForumPage;