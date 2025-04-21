// Layout.jsx
import { Link, Navigate, Outlet } from 'react-router-dom';
import AuthModal from './AuthModal.jsx';
import AuthModalContext from './AuthModalContext.jsx';
import Header from './Header.jsx';
import SideNav from './SideNav.jsx';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Layout() {
  const [showAuthModal, setShowAuthModal] = useState('false');
  const [user, setUser] = useState({});

  const navigate = useNavigate();


  useEffect(() => {
    getUser();
  }, []);

  function logout() {
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}user/logout`, {}, { withCredentials: true })
      .then(() =>
        setUser({}),
        navigate('/')
      );
  }

  function getUser() {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}user/getUser`, { withCredentials: true })
      .then((resp) => setUser(resp.data));
  }

  return (
    <AuthModalContext.Provider value={{ show: showAuthModal, setShow: setShowAuthModal }}>
      <UserContext.Provider value={{ ...user, logout, getUser, setUser }}>
        <Header />
        <AuthModal />
        <div className="flex bg-reddit_dark">
          <SideNav />
          <main className="flex-1  top-14 relative ml-0 md:ml-60 bg-reddit_dark text-reddit_text min-h-screen">
           <Outlet />
          </main>
        </div>
      </UserContext.Provider>
    </AuthModalContext.Provider>
  );
}
