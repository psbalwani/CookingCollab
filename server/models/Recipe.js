// models/Recipe.js
import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: [String],
  instructions: String,
  cooking_time: String,
  difficulty: String,
  image_url: String,
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Recipe', recipeSchema);
