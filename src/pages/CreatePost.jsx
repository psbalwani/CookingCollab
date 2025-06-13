import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/create-post.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const categories = [
    { value: 'general', label: 'General Discussion', icon: '💬' },
    { value: 'tips', label: 'Cooking Tips', icon: '💡' },
    { value: 'ingredients', label: 'Ingredient Talk', icon: '🥕' },
    { value: 'techniques', label: 'Techniques', icon: '👨‍🍳' },
    { value: 'equipment', label: 'Equipment', icon: '🍳' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/forum', formData);
      navigate(`/forum/${response.data.id}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="container">
        <div className="form-header">
          <h1>Start New Discussion</h1>
          <p>Share your thoughts and questions with the community</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="category">Discussion Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">Discussion Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="What would you like to discuss?"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Your Message *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="12"
              placeholder="Share your thoughts, ask questions, or start a conversation..."
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/forum')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Discussion...' : 'Start Discussion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;