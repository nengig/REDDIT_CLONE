import express, { json } from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// dummy database
let posts = [
  { 
    id: 1, 
    title: "First Post", 
    content: "This is the first post!",
    comments: [] 
  },
  { 
    id: 2, 
    title: "Second Post", 
    content: "This is the second post!",
    comments: []
  }
];

// Middleware
app.use(cors());
app.use(json());

// get all posts with their comments
app.get('/posts', (req, res) => {
  res.json(posts);
});

// create a new post
app.post('/posts', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    comments: []
  };

  // add post to front of array to keep recent posts at the top
  posts.unshift(newPost);
  res.status(201).json(newPost);
});

// dummy comment section
app.post('/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const { author, content } = req.body;

  // find post by id
  const post = posts.find(p => p.id === parseInt(postId));

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (!author || !content) {
    return res.status(400).json({ message: 'Author and content are required for the comment' });
  }

  const newComment = {
    id: post.comments.length + 1,
    author,
    content
  };

  // addcomment
  post.comments.push(newComment);
  res.status(201).json(newComment);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
