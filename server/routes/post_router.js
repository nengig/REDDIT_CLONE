import express from 'express';
import Posts from '../models/Post.js';


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// adding a post

router.post('/', async (req, res) => {
  const { title, content, author } = req.body;
  console.log(req.body);

  if (!title || !content || !author) {
    return res.status(400).json({ message: 'Title, content, and author are required' });
  }

  const newPost = new Posts({
    title,
    content,
    author,
  });

  try {
    const savedPost = await newPost.save(); // Save new post to MongoDB
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// Route to fetch a specific post by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post', error: err.message });
  }
});


export default router;
