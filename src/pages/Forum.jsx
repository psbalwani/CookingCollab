import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/forum.css';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/forum');
      setPosts(response.data);
    } catch (error) {
      setError('Failed to fetch forum posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.category === filter;
  });

  const categories = [
    { value: 'all', label: 'All Posts', icon: '📋' },
    { value: 'general', label: 'General Discussion', icon: '💬' },
    { value: 'tips', label: 'Cooking Tips', icon: '💡' },
    { value: 'ingredients', label: 'Ingredient Talk', icon: '🥕' },
    { value: 'techniques', label: 'Techniques', icon: '👨‍🍳' },
    { value: 'equipment', label: 'Equipment', icon: '🍳' },
  ];

  if (loading) return <div className="loading">Loading forum posts...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="forum-page">
      <div className="container">
        <div className="forum-header">
          <h1>Community Forum</h1>
          <p>Connect with fellow food enthusiasts and share your culinary knowledge</p>
          {user && (
            <Link to="/forum/create" className="btn btn-primary">
              Start New Discussion
            </Link>
          )}
        </div>

        <div className="forum-filters">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setFilter(category.value)}
              className={`filter-btn ${filter === category.value ? 'active' : ''}`}
            >
              <span className="filter-icon">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <h3>No discussions yet</h3>
            <p>Be the first to start a conversation in this category!</p>
            {user && (
              <Link to="/forum/create" className="btn btn-primary">
                Start First Discussion
              </Link>
            )}
          </div>
        ) : (
          <div className="forum-posts">
            {filteredPosts.map((post) => (
              <div key={post.id} className="forum-post-card">
                <div className="post-header">
                  <div className="post-category-badge">
                    {categories.find(cat => cat.value === post.category)?.icon || '📋'}
                    {post.category}
                  </div>
                  <div className="post-meta">
                    <span className="post-author">
                      By {post.users?.username || 'Anonymous'}
                    </span>
                    <span className="post-date">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="post-content">
                  <h3 className="post-title">
                    <Link to={`/forum/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="post-excerpt">
                    {post.content.length > 150 
                      ? `${post.content.substring(0, 150)}...` 
                      : post.content
                    }
                  </p>
                </div>
                
                <div className="post-footer">
                  <Link to={`/forum/${post.id}`} className="btn btn-outline">
                    Join Discussion
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;