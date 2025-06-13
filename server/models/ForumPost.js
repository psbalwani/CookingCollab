import mongoose from 'mongoose';

const ForumPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('ForumPost', ForumPostSchema);