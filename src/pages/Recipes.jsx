import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/recipes.css';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/recipes');
      setRecipes(response.data);
    } catch (error) {
      setError('Failed to fetch recipes');
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="recipes-page">
      <div className="container">
        <div className="page-header">
          <h1>Recipe Collection</h1>
          <p>Discover amazing recipes from our community</p>
          {user && (
            <Link to="/recipes/create" className="btn btn-primary">
              Share Your Recipe
            </Link>
          )}
        </div>
        
        {recipes.length === 0 ? (
          <div className="empty-state">
            <h3>No recipes yet</h3>
            <p>Be the first to share a recipe with the community!</p>
            {user && (
              <Link to="/recipes/create" className="btn btn-primary">
                Create First Recipe
              </Link>
            )}
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-image">
                  <img 
                    src={recipe.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'} 
                    alt={recipe.title}
                  />
                </div>
                
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  <p className="recipe-description">{recipe.description}</p>
                  
                  <div className="recipe-meta">
                    <span className="recipe-time">⏱️ {recipe.cooking_time} min</span>
                    <span className="recipe-difficulty">
                      {recipe.difficulty === 'easy' && '🟢 Easy'}
                      {recipe.difficulty === 'medium' && '🟡 Medium'}
                      {recipe.difficulty === 'hard' && '🔴 Hard'}
                    </span>
                  </div>
                  
                  <div className="recipe-author">
                    By {recipe.users?.username || 'Anonymous'}
                  </div>
                  
                  <div className="recipe-actions">
                    <Link to={`/recipes/${recipe.id}`} className="btn btn-secondary">
                      View Recipe
                    </Link>
                    {user && (
                      <Link to={`/recipes/${recipe.id}/edit`} className="btn btn-outline">
                        Create Fusion
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipes;