import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import forumRoutes from './routes/forum.js';
import searchRoutes from './routes/search.js';

// const connectDB = require("./config/database.js");
import connectDB from './config/database.js';

// require("dotenv").config();

connectDB(); // connect to MongoDB

// const app = express();
// rest of your server setup

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Cooking Collab API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`CORS enabled for http://localhost:5173`);
});