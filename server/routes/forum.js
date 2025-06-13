// import express from 'express';
// import { supabase } from '../config/supabase.js';
// import { authenticateToken } from '../middleware/auth.js';

// const router = express.Router();

// // Get all forum posts
// router.get('/', async (req, res) => {
//   try {
//     const { data: posts, error } = await supabase
//       .from('forum_posts')
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

//     res.json(posts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get single forum post with replies
// router.get('/:id', async (req, res) => {
//   try {
//     const { data: post, error } = await supabase
//       .from('forum_posts')
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
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     // Get replies
//     const { data: replies } = await supabase
//       .from('forum_replies')
//       .select(`
//         *,
//         users (
//           id,
//           username
//         )
//       `)
//       .eq('post_id', req.params.id)
//       .order('created_at', { ascending: true });

//     res.json({ ...post, replies: replies || [] });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Create forum post
// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const { title, content, category } = req.body;

//     const { data: post, error } = await supabase
//       .from('forum_posts')
//       .insert([
//         {
//           title,
//           content,
//           category,
//           author_id: req.user.userId,
//         }
//       ])
//       .select()
//       .single();

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.status(201).json(post);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Create forum reply
// router.post('/:id/replies', authenticateToken, async (req, res) => {
//   try {
//     const { content } = req.body;

//     const { data: reply, error } = await supabase
//       .from('forum_replies')
//       .insert([
//         {
//           content,
//           post_id: req.params.id,
//           author_id: req.user.userId,
//         }
//       ])
//       .select()
//       .single();

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.status(201).json(reply);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

import express from 'express';
import ForumPost from '../models/ForumPost.js';
import ForumReply from '../models/ForumReply.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await ForumPost.find().populate('author_id', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id).populate('author_id', 'username');
    const replies = await ForumReply.find({ post_id: req.params.id }).populate('author_id', 'username').sort({ createdAt: 1 });
    res.json({ ...post.toObject(), replies });
  } catch (error) {
    res.status(404).json({ error: 'Post not found' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = await ForumPost.create({ title, content, category, author_id: req.user.userId });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/replies', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const reply = await ForumReply.create({ content, post_id: req.params.id, author_id: req.user.userId });
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
