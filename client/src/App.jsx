import { useEffect, useState } from 'react';
import axios from 'axios';

import Header from './Header.jsx';
import BoardHeader from './BoardHeader.jsx';
import SubredditSidebar from './SubredditSidebar.jsx';
import AuthModal from './AuthModal.jsx';
import AuthModalContext from './AuthModalContext.jsx';
import UserContext from './UserContext.jsx';
import PostList from './PostList.jsx'; // Displaying all posts

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}user/getUser`, {
        withCredentials: true,
      })
      .then((response) => setUser(response.data));
  }, []);

  function logout() {
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}user/logout`, '', {
        withCredentials: true,
      })
      .then(() => setUser({}));
  }

  return (
    <div className="bg-reddit_dark min-h-screen text-reddit_text">
      <AuthModalContext.Provider
        value={{ show: showAuthModal, setShow: setShowAuthModal }}
      >
        <UserContext.Provider value={{ ...user, logout, setUser }}>
          <Header />
          <BoardHeader />

          {/* Layout split: Main content and Sidebar */}
          <div className="flex flex-col lg:flex-row px-6 mt-6 gap-6">
            {/* LEFT: Main Content */}
            <div className="w-full lg:w-2/3 space-y-6">
              <PostList /> {/* List of all posts */}
            </div>

            {/* RIGHT: Sidebar */}
            <div className="w-full lg:w-1/3">
              <SubredditSidebar />
            </div>
          </div>

          <AuthModal />
        </UserContext.Provider>
      </AuthModalContext.Provider>
    </div>
  );
}

export default App;
