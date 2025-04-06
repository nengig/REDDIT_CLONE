import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    title: String,
    content: String,
    author: String,
    createdAt: { type: Date, default: Date.now },
    comments: [
      {
        author: String,
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  });

  const Posts = model('Posts', postSchema);

export default Posts;