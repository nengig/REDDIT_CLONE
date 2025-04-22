import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

import Layout from './layout.jsx';
import Home from './Home.jsx';
import UserProfile from './UserProfile.jsx';
import PostingApp from './PostingApp.jsx';
import SearchResultsPage from './searchResultsPage.jsx';

import './index.css';
import './style.css';
import CreateCommunity from './CreateCommunity.jsx';
import ViewCommunity from './ViewCommunity.jsx';
import ViewUserProfile from './ViewUserProfile.jsx';
import PostsForm from './PostsForm.jsx';
import PostPage from './PostPage.jsx';
import Homepage from './Homepage.jsx';
import MyCommunitiesPage from './MyCommunitiesPage.jsx';
import ScrollToTop from './ScrollToTop.jsx';



createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <ScrollToTop />
      <Routes>
        {/* all routes share the Layout */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/profile" element={<UserProfile />} />

          <Route path="/posts" element={<PostingApp />} />

          <Route path="/create-post" element={<PostsForm />} />
          <Route path="/myCommunities" element={<MyCommunitiesPage />} />
          <Route path="/edit-post/:id" element={<PostsForm />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path='/search/:text' element={<SearchResultsPage />} />
          <Route path='/createCommunity' element={<CreateCommunity />} />
          <Route path='/r/:name' element={<ViewCommunity />} />
          <Route path="/u/:username" element={<ViewUserProfile />} />
          {/* 404 fallback */}
          <Route path="*" element={<p className="p-6">Page not found</p>} />
        </Route>
      </Routes>
    </Router>
  </Provider>
);

