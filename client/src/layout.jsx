// Layout.jsx
import { Link, Outlet } from 'react-router-dom';
import AuthModal from './AuthModal.jsx';
import AuthModalContext from './AuthModalContext.jsx';
import Header from './Header.jsx';
import BoardHeader from './BoardHeader.jsx';
import PostForm from './BoardPostForm.jsx';
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
        {/* If you only want PostForm on certain pages, move this into Home.jsx instead */}
        <AuthModal />

        {/* This is where nested routes will render */}
        <Outlet />
      </UserContext.Provider>
    </AuthModalContext.Provider>
  );
}
