// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { supabase } from '../config/supabase.js';

// const router = express.Router();

// // Register
// router.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check if user exists
//     const { data: existingUser } = await supabase
//       .from('users')
//       .select('id')
//       .eq('email', email)
//       .single();

//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create user
//     const { data: user, error } = await supabase
//       .from('users')
//       .insert([
//         {
//           username,
//           email,
//           password: hashedPassword,
//         }
//       ])
//       .select()
//       .single();

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     // Generate token
//     const token = jwt.sign(
//       { userId: user.id, email: user.email },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '24h' }
//     );

//     res.status(201).json({
//       message: 'User created successfully',
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('email', email)
//       .single();

//     if (error || !user) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     // Check password
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     // Generate token
//     const token = jwt.sign(
//       { userId: user.id, email: user.email },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '24h' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ message: 'User created successfully', token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;