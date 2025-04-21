import express from 'express';
import Posts from '../models/Post.js';
import Follow from '../models/Follow.js';
import Community from '../models/Community.js';
import auth from '../middlewares/auth.js';
import User from '../models/User.js';


const postRouter = express.Router();

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


postRouter.get('/searchPosts', async (req, res) => {

  const searchTerm = req.query.search;


  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  const searchTerms = searchTerm.split(/\s+/);

  try {
    const query = {
      $or: searchTerms.map(term => ({
        $or: [
          // { title: { $regex: `\\b${term}\\b`, $options: 'i' } },
          // { content: { $regex: `\\b${term}\\b`, $options: 'i' } }
          { title: { $regex: `${term}`, $options: 'i' } },
          { content: { $regex: `${term}`, $options: 'i' } }
        ]
      }))
    };

    const results = await Posts.find(query);


    res.json(results);
  } catch (error) {
    console.error('Error occurred while searching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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

postRouter.delete('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.deleted) {
      return res.status(400).json({ error: 'Post already deleted' });
    }

    post.deleted = true;
    post.deletedAt = new Date();
    // post.title = '[deleted]';
    post.body = '[deleted]';
    post.author = '[deleted]'

    await post.save();

    res.json({ message: 'Post soft-deleted and content removed' });
  } catch (err) {
    console.error('❌ Error soft-deleting post:', err.message);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});



postRouter.get('/posts/home', auth.getToken, async (req, res) => {
  try {
    const userId = req.userInfo.id; 
  
    const follows = await Follow.find({ followerId: userId }).select('followingId');
    const followingIds = follows.map(f => f.followingId);

    
    const communities = await Community.find({ members: userId }).select('_id');
    const communityIds = communities.map(c => c._id);

    const query = {
      deleted: false,
      $or: [
        { userId: userId },
        { userId: { $in: followingIds } },
        { communityId: { $in: communityIds } }
      ]
    };

    // Fetch posts
    const posts = await Posts.find(query)
      .sort({ createdAt: -1 }) //sorts the results 
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts for homepage:', err.message);
    res.status(500).json({ error: 'Failed to fetch posts for homepage' });
  }
});





export default postRouter;
