import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './layout.jsx';
import Home from './Home.jsx';
import UserProfile from './UserProfile.jsx';
import { Provider } from 'react-redux';
import CommentsPage from './CommentsPage.jsx';
import PostingApp from './PostingApp.jsx';
import PostsForm from './PostsForm.jsx';
import App from './App.jsx';
import { store } from './app/store';

import PostDetails from './PostDetails.jsx';

import './index.css';
import './style.css';
import PostPage from './PostPage.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* <Route index element={<App />} /> */}
          <Route index element={<App />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="create-post" element={<PostsForm />} />
          <Route path="edit-post/:id" element={<PostsForm />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="comments" element={<CommentsPage />} />
          <Route path="*" element={<p className="p-6">Page not found</p>} />
        </Route>
      </Routes>

    </Router>
  </Provider>
)
