import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/forum-post.css';

const ForumPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/forum/${id}`);
      setPost(response.data);
    } catch (error) {
      setError('Post not found');
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to reply');
      return;
    }

    if (!replyContent.trim()) {
      setError('Reply cannot be empty');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post(`http://localhost:5000/api/forum/${id}/replies`, {
        content: replyContent,
      });
      
      setReplyContent('');
      fetchPost(); // Refresh to show new reply
    } catch (error) {
      setError('Failed to post reply');
      console.error('Error posting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error && !post) return <div className="error-message">{error}</div>;
  if (!post) return <div className="error-message">Post not found</div>;

  return (
    <div className="forum-post-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/forum">← Back to Forum</Link>
        </div>

        <article className="forum-post">
          <header className="post-header">
            <div className="post-category-badge">
              {post.category}
            </div>
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <span className="post-author">
                By {post.users?.username || 'Anonymous'}
              </span>
              <span className="post-date">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </header>

          <div className="post-content">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        <section className="replies-section">
          <h2 className="replies-title">
            Discussion ({post.replies?.length || 0} replies)
          </h2>

          {post.replies && post.replies.length > 0 && (
            <div className="replies-list">
              {post.replies.map((reply, index) => (
                <div key={reply.id} className="reply-card">
                  <div className="reply-header">
                    <span className="reply-author">
                      {reply.users?.username || 'Anonymous'}
                    </span>
                    <span className="reply-date">
                      {new Date(reply.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="reply-content">
                    {reply.content.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {user ? (
            <form onSubmit={handleReplySubmit} className="reply-form">
              <h3>Add Your Reply</h3>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows="5"
                  required
                />
              </div>
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Posting Reply...' : 'Post Reply'}
                </button>
              </div>
            </form>
          ) : (
            <div className="login-prompt">
              <p>
                <Link to="/login" className="auth-link">Login</Link> or{' '}
                <Link to="/register" className="auth-link">Register</Link> to join the discussion
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ForumPost;