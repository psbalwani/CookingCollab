import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Cooking Collab</h1>
          <p className="hero-subtitle">
            Discover, share, and create amazing recipes with our community of food lovers
          </p>
          
          <div className="hero-actions">
            {user ? (
              <>
                <Link to="/recipes" className="btn btn-primary">
                  Browse Recipes
                </Link>
                <Link to="/recipes/create" className="btn btn-secondary">
                  Share Your Recipe
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Join Our Community
                </Link>
                <Link to="/recipes" className="btn btn-secondary">
                  Browse Recipes
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="hero-image">
          <img 
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" 
            alt="Delicious cooking" 
          />
        </div>
      </section>
      
      <section className="features">
        <div className="container">
          <h2 className="section-title">What You Can Do</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Publish Recipes</h3>
              <p>Share your favorite recipes with the community and help others discover new flavors</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Create Fusions</h3>
              <p>Edit existing recipes to create your own unique fusion dishes and variations</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Join Discussions</h3>
              <p>Connect with fellow food enthusiasts in our community forum</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Find recipes based on ingredients you have at home</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;