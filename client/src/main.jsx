import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import './style.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import CommentsPage from './CommentsPage.jsx';
import PostDetails from './PostDetails.jsx';
import PostingApp from './PostingApp.jsx';
import PostsForm from './PostsForm.jsx';
import { store } from './app/store';


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      {/* <Route path="/" element={<PostingApp />} /> Main page where all posts are listed */}

      <Route path="/Comments" element={<CommentsPage />} />
      <Route path='/create-post' element={<PostsForm />}></Route>
      {/* edit mode */}
      <Route path="/edit-post/:id" element={<PostsForm />} /> 
      <Route path="/posts" element={<PostingApp />} />
      <Route path="/post/:id" element={<PostDetails />} /> {/* Dynamic route for individual post */}
    </Routes>
  </Router>
  </Provider>
)
