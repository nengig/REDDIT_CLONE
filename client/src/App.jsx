import AuthModal from './AuthModal.jsx';
import AuthModalContext from './AuthModalContext.jsx';
import BoardHeader from './BoardHeader.jsx';
import PostForm from './BoardPostForm.jsx';
import Header from './Header.jsx';
import { useEffect, useState } from 'react';
import Avatar from './avatar.png'
import UserContext from './UserContext.jsx';
import axios from 'axios';
function App() {
  const [showAuthModal, setShowAuthModal] = useState('false')
  const [user, setUser] = useState({})
  useEffect(() => {
    console.log(`server: ${import.meta.env.VITE_SERVER_URL}user/getUser`)
    axios.get(`${import.meta.env.VITE_SERVER_URL}user/getUser`, { withCredentials: true })
      .then((response) => setUser(response.data))
  }, [])
  function logout() {
    axios.post(`${import.meta.env.VITE_SERVER_URL}user/logout`, '', {withCredentials:true})
      .then(()=>setUser({}))
  }
  return (
    <div>
      <AuthModalContext.Provider value={{ show: showAuthModal, setShow: setShowAuthModal }}>
        <UserContext.Provider value={{ ...user, logout, setUser }}>
          <Header />
          <BoardHeader />
          <PostForm />
          <AuthModal />
          <div className="px-6 bg-reddit_dark text-reddit_text ">
            <div className='border border-reddit_border bg-reddit_dark-brighter p-2 rounded-md'>
              <h5 className='text-reddit_text-darker text-sm mb-1'>Posted by u/test123 5 hours ago</h5>
              <h2 className='text-xl mb-3'>Sample Title with some Lorem Ipsum</h2>
              <div className='text-sm leading-6'>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                  sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                  adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                  dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                  exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                  consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
                  quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
                  nulla pariatur? Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                  sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                  adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                  dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                  exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                  consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
                  quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
                  nulla pariatur? Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                  sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                  adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                  dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                  exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                  consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
                  quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
                  nulla pariatur? Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                  sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                  adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                  dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                  exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                  consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
                  quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
                  nulla pariatur? </p>
              </div>
            </div>
          </div>
        </UserContext.Provider>
      </AuthModalContext.Provider>
    </div>
  )
}
export default App;


