import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import './style.css'
import App from './App.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommentsPage from './CommentsPage.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Comments" element={<CommentsPage />} />
    </Routes>
  </Router>
)
