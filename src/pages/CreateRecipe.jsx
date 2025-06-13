import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/recipe-form.css';

const CreateRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cooking_time: '',
    difficulty: 'easy',
    image_url: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

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
      const response = await axios.post('http://localhost:5000/api/recipes', formData);
      navigate(`/recipes/${response.data.id}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-form-page">
      <div className="container">
        <div className="form-header">
          <h1>Share Your Recipe</h1>
          <p>Share your culinary creation with the community</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="recipe-form">
          <div className="form-group">
            <label htmlFor="title">Recipe Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Give your recipe a catchy name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Tell us about your recipe..."
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cooking_time">Cooking Time (minutes) *</label>
              <input
                type="number"
                id="cooking_time"
                name="cooking_time"
                value={formData.cooking_time}
                onChange={handleChange}
                required
                min="1"
                placeholder="30"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty Level *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
              >
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="image_url">Recipe Image URL</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/your-recipe-image.jpg"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="ingredients">Ingredients *</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              required
              rows="8"
              placeholder="List each ingredient on a new line:&#10;2 cups flour&#10;1 tsp salt&#10;3 eggs&#10;1 cup milk"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="instructions">Instructions *</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              required
              rows="10"
              placeholder="Write each step on a new line:&#10;Preheat oven to 350°F&#10;Mix dry ingredients in a bowl&#10;Add wet ingredients and stir&#10;Bake for 25 minutes"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/recipes')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Recipe...' : 'Share Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;