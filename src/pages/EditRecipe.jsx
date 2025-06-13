import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/recipe-form.css';

const EditRecipe = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cooking_time: '',
    difficulty: 'easy',
    image_url: '',
  });
  const [originalRecipe, setOriginalRecipe] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCreatingFusion, setIsCreatingFusion] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRecipe();
  }, [id, user]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      const recipe = response.data;
      setOriginalRecipe(recipe);
      
      // Check if user is the author
      if (recipe.author_id === user.id) {
        setFormData({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cooking_time: recipe.cooking_time.toString(),
          difficulty: recipe.difficulty,
          image_url: recipe.image_url || '',
        });
      } else {
        // Creating a fusion - pre-populate with slight modifications
        setIsCreatingFusion(true);
        setFormData({
          title: `${recipe.title} (Fusion by ${user.username})`,
          description: `My fusion version of ${recipe.title}. ${recipe.description}`,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cooking_time: recipe.cooking_time.toString(),
          difficulty: recipe.difficulty,
          image_url: recipe.image_url || '',
        });
      }
    } catch (error) {
      setError('Recipe not found');
      navigate('/recipes');
    }
  };

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
      if (isCreatingFusion) {
        // Create new recipe (fusion)
        const response = await axios.post('http://localhost:5000/api/recipes', formData);
        navigate(`/recipes/${response.data.id}`);
      } else {
        // Update existing recipe
        const response = await axios.put(`http://localhost:5000/api/recipes/${id}`, formData);
        navigate(`/recipes/${response.data.id}`);
      }
    } catch (error) {
      setError(error.response?.data?.error || `Failed to ${isCreatingFusion ? 'create fusion' : 'update recipe'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!originalRecipe) {
    return <div className="loading">Loading recipe...</div>;
  }

  return (
    <div className="recipe-form-page">
      <div className="container">
        <div className="form-header">
          <h1>
            {isCreatingFusion ? '🔄 Create Your Fusion' : '✏️ Edit Recipe'}
          </h1>
          <p>
            {isCreatingFusion 
              ? `Create your own version inspired by "${originalRecipe.title}"` 
              : 'Update your recipe details'
            }
          </p>
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
              placeholder="List each ingredient on a new line"
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
              placeholder="Write each step on a new line"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate(`/recipes/${id}`)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading 
                ? (isCreatingFusion ? 'Creating Fusion...' : 'Updating Recipe...') 
                : (isCreatingFusion ? 'Create Fusion' : 'Update Recipe')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;