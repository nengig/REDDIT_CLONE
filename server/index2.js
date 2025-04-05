// add order by date (add creation date)
//show number of comments on post
// clicking post goes to the page specific to the post
// only show comments on post page
//show username
// show date
// delete post (tie deleting post to user)?


import express, { json } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/post_router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use('/posts', router);

console.log(process.env.MONGODB_URI);
// connect to mongodb
const startServer = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('DB connected');
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('DB connection failed', err);
      process.exit(1);
    }
  };
  
  // start server
  startServer();

// catch-all
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});




// // get all posts with their comments
// app.get('/posts', (req, res) => {
//     res.json(posts);
// });

// // create a new post
// app.post('/posts', (req, res) => {
//     const { title, content } = req.body;

//     if (!title || !content) {
//         return res.status(400).json({ message: 'Title and content are required' });
//     }

//     const newPost = {
//         id: posts.length + 1,
//         title,
//         content,
//         comments: []
//     };

//     // add post to front of array to keep recent posts at the top
//     posts.unshift(newPost);
//     res.status(201).json(newPost);
// });

// // dummy comment section
// app.post('/posts/:postId/comments', (req, res) => {
//     const { postId } = req.params;
//     const { author, content } = req.body;

//     // find post by id
//     const post = posts.find(p => p.id === parseInt(postId));

//     if (!post) {
//         return res.status(404).json({ message: 'Post not found' });
//     }

//     if (!author || !content) {
//         return res.status(400).json({ message: 'Author and content are required for the comment' });
//     }

//     const newComment = {
//         id: post.comments.length + 1,
//         author,
//         content
//     };

//     // addcomment
//     post.comments.push(newComment);
//     res.status(201).json(newComment);
// });
