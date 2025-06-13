import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { user } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() && !ingredientSearch.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append('query', searchQuery.trim());
      }
      if (ingredientSearch.trim()) {
        params.append('ingredients', ingredientSearch.trim());
      }

      const response = await axios.get(`http://localhost:5000/api/search/recipes?${params}`);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIngredientSearch('');
    setResults([]);
    setSearched(false);
  };

  const popularIngredients = [
    'chicken', 'beef', 'pasta', 'rice', 'tomatoes', 'onions', 
    'garlic', 'cheese', 'eggs', 'potatoes', 'flour', 'milk'
  ];

  const handleIngredientClick = (ingredient) => {
    setIngredientSearch(prev => {
      const ingredients = prev.split(',').map(i => i.trim()).filter(Boolean);
      if (ingredients.includes(ingredient)) {
        return ingredients.filter(i => i !== ingredient).join(', ');
      } else {
        return [...ingredients, ingredient].join(', ');
      }
    });
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1>Find Your Perfect Recipe</h1>
          <p>Search by recipe name or the ingredients you have on hand</p>
        </div>

        <div className="search-form-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-row">
              <div className="form-group">
                <label htmlFor="searchQuery">Recipe Name or Keywords</label>
                <input
                  type="text"
                  id="searchQuery"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., pasta, chicken curry, chocolate cake..."
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ingredientSearch">Available Ingredients</label>
                <input
                  type="text"
                  id="ingredientSearch"
                  value={ingredientSearch}
                  onChange={(e) => setIngredientSearch(e.target.value)}
                  placeholder="e.g., chicken, tomatoes, onions (separate with commas)"
                />
              </div>
            </div>

            <div className="search-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Searching...' : '🔍 Search Recipes'}
              </button>
              {(searchQuery || ingredientSearch || searched) && (
                <button type="button" onClick={clearSearch} className="btn btn-outline">
                  Clear Search
                </button>
              )}
            </div>
          </form>

          <div className="popular-ingredients">
            <h3>Popular Ingredients</h3>
            <p>Click to add/remove ingredients from your search:</p>
            <div className="ingredient-tags">
              {popularIngredients.map(ingredient => (
                <button
                  key={ingredient}
                  type="button"
                  onClick={() => handleIngredientClick(ingredient)}
                  className={`ingredient-tag ${
                    ingredientSearch.split(',').map(i => i.trim()).includes(ingredient) 
                      ? 'selected' 
                      : ''
                  }`}
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="search-results">
          {loading && <div className="loading">Searching recipes...</div>}
          
          {searched && !loading && results.length === 0 && (
            <div className="no-results">
              <h3>No recipes found</h3>
              <p>Try different keywords or ingredients, or browse all recipes.</p>
              <Link to="/recipes" className="btn btn-secondary">
                Browse All Recipes
              </Link>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className="results-header">
                <h2>Found {results.length} recipe{results.length !== 1 ? 's' : ''}</h2>
              </div>
              
              <div className="recipes-grid">
                {results.map((recipe) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;