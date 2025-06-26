// post creation form 

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Changed from next/router
import { usePosts } from '../../hooks/usePosts';

const CreatePost: React.FC<{ userId: number }> = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { createPost } = usePosts();
  const navigate = useNavigate(); // Changed from useRouter

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
      
      // Reset form
      setTitle('');
      setContent('');
      setTopic('');
      setSubTopic('');
      
      // Redirect to forum page instead of reloading
      navigate('/community');
      // OR if you want to refresh the data without full page reload:
      // window.location.reload(); // Use sparingly
    } catch (err) {
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Create a New Post</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <select
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;