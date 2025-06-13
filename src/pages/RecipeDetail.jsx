import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/recipe-detail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      setError('Recipe not found');
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`http://localhost:5000/api/recipes/${id}`);
        navigate('/recipes');
      } catch (error) {
        setError('Failed to delete recipe');
      }
    }
  };

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return <div className="error-message">Recipe not found</div>;

  const isAuthor = user && user.id === recipe.author_id;

  return (
    <div className="recipe-detail">
      <div className="container">
        <div className="recipe-hero">
          <div className="recipe-image">
            <img 
              src={recipe.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'} 
              alt={recipe.title}
            />
          </div>
          
          <div className="recipe-header">
            <h1>{recipe.title}</h1>
            <p className="recipe-description">{recipe.description}</p>
            
            <div className="recipe-meta">
              <span className="meta-item">
                <strong>⏱️ Cooking Time:</strong> {recipe.cooking_time} minutes
              </span>
              <span className="meta-item">
                <strong>📊 Difficulty:</strong> 
                {recipe.difficulty === 'easy' && ' 🟢 Easy'}
                {recipe.difficulty === 'medium' && ' 🟡 Medium'}
                {recipe.difficulty === 'hard' && ' 🔴 Hard'}
              </span>
              <span className="meta-item">
                <strong>👨‍🍳 Chef:</strong> {recipe.users?.username || 'Anonymous'}
              </span>
            </div>
            
            <div className="recipe-actions">
              {user && (
                <Link to={`/recipes/${recipe.id}/edit`} className="btn btn-secondary">
                  Create Fusion
                </Link>
              )}
              {isAuthor && (
                <>
                  <Link to={`/recipes/${recipe.id}/edit`} className="btn btn-outline">
                    Edit Recipe
                  </Link>
                  <button onClick={handleDelete} className="btn btn-danger">
                    Delete Recipe
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="recipe-content">
          <div className="ingredients-section">
            <h2>🥕 Ingredients</h2>
            <div className="ingredients-list">
              {recipe.ingredients.split('\n').map((ingredient, index) => (
                <div key={index} className="ingredient-item">
                  {ingredient.trim()}
                </div>
              ))}
            </div>
          </div>
          
          <div className="instructions-section">
            <h2>👩‍🍳 Instructions</h2>
            <div className="instructions-list">
              {recipe.instructions.split('\n').map((instruction, index) => (
                <div key={index} className="instruction-item">
                  <span className="step-number">{index + 1}</span>
                  <span className="step-text">{instruction.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;