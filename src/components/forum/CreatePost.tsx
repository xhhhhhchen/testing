import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';

const CreatePost: React.FC<{ userId: number; onPostCreated?: () => void }> = ({ userId, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { createPost } = usePosts();
  const navigate = useNavigate();
  

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title || !content || !topic) {
    setError('Title, content, and topic are required');
    return;
  }

  setIsSubmitting(true);
  setError('');

  try {
    const newPost = {
      user_id: userId,
      title,
      content,
      topic,
      sub_topic: subTopic || '',
    };

    await createPost(newPost);

    setTitle('');
    setContent('');
    setTopic('');
    setSubTopic('');

    (document.getElementById('create-post-modal') as HTMLDialogElement)?.close();

    // 🔁 Refresh posts
    if (onPostCreated) onPostCreated();

    navigate('/community');
  } catch (err) {
    setError('Failed to create post. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Create New Post</h2>
          <button
            onClick={() => (document.getElementById('create-post-modal') as HTMLDialogElement)?.close()}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6 hover:bg-green-800/10 cursor-pointer rounded-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-green-500"
              placeholder="What's your post about?"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-green-500"
              placeholder="Share your thoughts..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <select
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-green-500"
                required
              >
                <option value="">Select a topic</option>
                <option value="Composting">Composting</option>
                <option value="Plants">Plants</option>
                <option value="Tank Maintenance">Tank Maintenance</option>
                <option value="Community">Community</option>
              </select>
            </div>

            <div>
              <label htmlFor="subTopic" className="block text-sm font-medium text-gray-700 mb-1">
                Sub-topic (optional)
              </label>
              <input
                type="text"
                id="subTopic"
                value={subTopic}
                onChange={(e) => setSubTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-green-500"
                placeholder="e.g., Vermicomposting, Succulents"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => (document.getElementById('create-post-modal') as HTMLDialogElement)?.close()}
              className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-700 text-white rounded-md cursor-pointer hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </>
              ) : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;