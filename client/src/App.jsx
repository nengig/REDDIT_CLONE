import { useEffect, useState } from 'react';
import axios from 'axios';

import Header from './Header.jsx';
import BoardHeader from './BoardHeader.jsx';
import SubredditSidebar from './SubredditSidebar.jsx';
import AuthModal from './AuthModal.jsx';
import AuthModalContext from './AuthModalContext.jsx';
import PostForm from './BoardPostForm.jsx';
import Post from './PostPage.jsx';
import CommentsPage from "./CommentsPage.jsx";
import Avatar from './avatar.png'
import UserContext from './UserContext.jsx';
import PostList from './PostList.jsx'; // Displaying all posts
import UserProfile from './UserProfile.jsx';

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
  function getUser() {
    console.log(`server: ${import.meta.env.VITE_SERVER_URL}user/getUser`)
    axios.get(`${import.meta.env.VITE_SERVER_URL}user/getUser`, { withCredentials: true })
      .then((response) => setUser(response.data))
  }
  return (
    <>
      <div className="bg-reddit_dark min-h-screen text-reddit_text">
        <AuthModalContext.Provider
          value={{ show: showAuthModal, setShow: setShowAuthModal }}>
          <UserContext.Provider value={{ ...user, logout, setUser }}>
            <BoardHeader />
            <div className="flex flex-col lg:flex-row px-6 gap-6 mt-6">
              {/* MAIN CONTENT */}
              <div className="w-full lg:w-2/3 space-y-6">
                <PostList />
              </div>
              {/* SIDEBAR */}
              <div className="w-full lg:w-1/3">
                <SubredditSidebar />
              </div>
            </div>
            <AuthModal />
            <CommentsPage />
          </UserContext.Provider >
        </AuthModalContext.Provider >
      </div >
    </>
  );

}

export default App;
