import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './layout.jsx';
import Home from './Home.jsx';
import UserProfile from './UserProfile.jsx';
import { Provider } from 'react-redux';
import CommentsPage from './CommentsPage.jsx';
import PostingApp from './PostingApp.jsx';
import PostsForm from './PostsForm.jsx';
import { store } from './app/store';

import PostDetails from './PostDetails.jsx';

import './index.css';
import './style.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <Router>
    <Routes>
      {/* all routes share the Layout */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="comments" element={<CommentsPage />} />
        <Route path="posts" element={<PostingApp />} />
        <Route path="create-post" element={<PostForm />} />
        <Route path="post/:id" element={<PostDetails />} />
        {/* 404 fallback */}
        <Route path="*" element={<p className="p-6">Page not found</p>} />
      </Route>
    </Routes>
  </Router>
  </Provider>
)
