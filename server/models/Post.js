import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  }
});

const Post = mongoose.model('Post', postSchema);

export default Post;
