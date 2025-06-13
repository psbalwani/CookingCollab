import mongoose from 'mongoose';

const ForumReplySchema = new mongoose.Schema({
  content: String,
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost' },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('ForumReply', ForumReplySchema);