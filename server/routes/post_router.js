import { Router } from 'express';
const postRouter = Router();
import Posts from '../models/Post.js';

// view all posts
postRouter.get('/', async (req, res) => {
  console.log('➡️ Received POST:', req.body);
  try {
    const posts = await Posts.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('❌ Error fetching posts:', err.message);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

// create a post
postRouter.post('/', async (req, res) => {
  console.log('➡️ Route is being hit!'); // This should log when the post request is made.
  console.log('➡️ Received Post Data:', req.body); //
  console.log('➡️ Received Post Data:', req.body); // Log the incoming request body
  try {
    const newPost = new Posts(req.body); // Ensure this is a valid Post object
    const savedPost = await newPost.save();
    console.log('Post to be saved:', newPost);
    console.log('✅ Post saved:', savedPost); // Log the saved post to verify
    res.status(201).json(savedPost);
  } catch (err) {
    console.error('❌ Error creating post:', err.message);
    res.status(500).json({ error: 'Failed to create post' });
  }
});


// Get a post by ID
postRouter.get('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error('❌ Error fetching post:', err.message);
    res.status(500).json({ error: 'Error retrieving post' });
  }
});

// edit posts
postRouter.put('/:id', async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  try {
    const updated = await Posts.findByIdAndUpdate(
      req.params.id,
      { title, body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating post:', err.message);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// delete posts
postRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await Posts.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting post:', err.message);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});


export default postRouter;
