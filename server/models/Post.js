import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  author: String,
  title: String,
  body: String,
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('Post', postSchema);
