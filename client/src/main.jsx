import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import './style.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommentsPage from './CommentsPage.jsx';
import CreatePostPage from './PostsForm.jsx';
import PostsPage from './Posts.jsx';
import PostDetails from './PostDetails.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Comments" element={<CommentsPage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/create-post" element={<CreatePostPage />} />
      <Route path="/posts/:id" element={<PostDetails />} />
    </Routes>
  </Router>
)
