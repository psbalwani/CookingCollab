// import express from 'express';
// import { supabase } from '../config/supabase.js';
// import { authenticateToken } from '../middleware/auth.js';

// const router = express.Router();

// // Get all recipes
// router.get('/', async (req, res) => {
//   try {
//     const { data: recipes, error } = await supabase
//       .from('recipes')
//       .select(`
//         *,
//         users (
//           id,
//           username
//         )
//       `)
//       .order('created_at', { ascending: false });

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.json(recipes);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get single recipe
// router.get('/:id', async (req, res) => {
//   try {
//     const { data: recipe, error } = await supabase
//       .from('recipes')
//       .select(`
//         *,
//         users (
//           id,
//           username
//         )
//       `)
//       .eq('id', req.params.id)
//       .single();

//     if (error) {
//       return res.status(404).json({ error: 'Recipe not found' });
//     }

//     res.json(recipe);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Create recipe
// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const { title, description, ingredients, instructions, cooking_time, difficulty, image_url } = req.body;

//     const { data: recipe, error } = await supabase
//       .from('recipes')
//       .insert([
//         {
//           title,
//           description,
//           ingredients,
//           instructions,
//           cooking_time,
//           difficulty,
//           image_url,
//           author_id: req.user.userId,
//         }
//       ])
//       .select()
//       .single();

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.status(201).json(recipe);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Update recipe
// router.put('/:id', authenticateToken, async (req, res) => {
//   try {
//     const { title, description, ingredients, instructions, cooking_time, difficulty, image_url } = req.body;

//     const { data: recipe, error } = await supabase
//       .from('recipes')
//       .update({
//         title,
//         description,
//         ingredients,
//         instructions,
//         cooking_time,
//         difficulty,
//         image_url,
//       })
//       .eq('id', req.params.id)
//       .eq('author_id', req.user.userId)
//       .select()
//       .single();

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.json(recipe);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete recipe
// router.delete('/:id', authenticateToken, async (req, res) => {
//   try {
//     const { error } = await supabase
//       .from('recipes')
//       .delete()
//       .eq('id', req.params.id)
//       .eq('author_id', req.user.userId);

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.json({ message: 'Recipe deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

import express from 'express';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 }).populate('author_id', 'username');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author_id', 'username');
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create recipe
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, ingredients, instructions, cooking_time, difficulty, image_url } = req.body;
    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      cooking_time,
      difficulty,
      image_url,
      author_id: req.user.userId,
    });
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update recipe
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author_id: req.user.userId },
      { ...req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Recipe not found or unauthorized' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete recipe
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Recipe.findOneAndDelete({
      _id: req.params.id,
      author_id: req.user.userId,
    });
    if (!deleted) return res.status(404).json({ error: 'Recipe not found or unauthorized' });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
