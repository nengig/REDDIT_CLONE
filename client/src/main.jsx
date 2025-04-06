import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import './style.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommentsPage from './CommentsPage.jsx';
import PostDetails from './PostDetails.jsx';
import PostingApp from './PostingApp.jsx';
import PostForm from './PostsForm.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Comments" element={<CommentsPage />} />
      <Route path="/posts" element={<PostingApp />} />
      <Route path="/create-post" element={<PostForm />} />
      <Route path="/post/:id" element={<PostDetails />} />
      
    </Routes>
  </Router>
)
