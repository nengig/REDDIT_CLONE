import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch all posts when the app is loaded
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:8000/posts');
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div className="app">
      <h1>Posts</h1>
      <div>
        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post._id}>
                <Link to={`/posts/${post._id}`}>
                  <h2>{post.title}</h2>
                  <p>{post.content.substring(0, 100)}...</p> {/* Display the first 100 characters of content */}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default App;
