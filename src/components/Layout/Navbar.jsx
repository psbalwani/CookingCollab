import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🍳 Cooking Collab
        </Link>
        
        <div className="nav-links">
          <Link to="/recipes" className="nav-link">Recipes</Link>
          <Link to="/forum" className="nav-link">Forum</Link>
          <Link to="/search" className="nav-link">Search</Link>
          
          {user ? (
            <div className="nav-user">
              <span className="nav-username">Hello, {user.username}!</span>
              <Link to="/recipes/create" className="nav-link create-btn">
                Create Recipe
              </Link>
              <button onClick={handleLogout} className="nav-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-btn">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;