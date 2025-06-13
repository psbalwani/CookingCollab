// import express from 'express';
// import { supabase } from '../config/supabase.js';

// const router = express.Router();

// // Search recipes by ingredients
// router.get('/recipes', async (req, res) => {
//   try {
//     const { ingredients, query } = req.query;

//     let searchQuery = supabase
//       .from('recipes')
//       .select(`
//         *,
//         users (
//           id,
//           username
//         )
//       `);

//     if (ingredients) {
//       const ingredientArray = ingredients.split(',').map(ing => ing.trim().toLowerCase());
      
//       // Search for recipes that contain any of the specified ingredients
//       searchQuery = searchQuery.or(
//         ingredientArray.map(ingredient => 
//           `ingredients.ilike.%${ingredient}%`
//         ).join(',')
//       );
//     }

//     if (query) {
//       searchQuery = searchQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
//     }

//     const { data: recipes, error } = await searchQuery
//       .order('created_at', { ascending: false });

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.json(recipes);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

import express from 'express';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

const router = express.Router();

// Search recipes
router.get('/recipes', async (req, res) => {
  try {
    const { ingredients, query } = req.query;

    let mongoQuery = {};

    if (ingredients) {
      const ingredientArray = ingredients.split(',').map(i => new RegExp(i.trim(), 'i'));
      mongoQuery.ingredients = { $in: ingredientArray };
    }

    if (query) {
      const regex = new RegExp(query, 'i');
      mongoQuery.$or = [
        { title: regex },
        { description: regex },
      ];
    }

    const recipes = await Recipe.find(mongoQuery).sort({ createdAt: -1 }).populate('author_id', 'username');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
