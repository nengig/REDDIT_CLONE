import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation

const PostsPage = () => {
  const [posts, setPosts] = useState([]);

  // Fetch posts from the backend
  useEffect(() => {
    fetch('http://localhost:8000/posts') // Adjust the URL based on your server configuration
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div className="posts-page">
      <h1>All Posts</h1>

      <Link to="/create-post">Create a New Post</Link> {/* Link to create post page */}

      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p><strong>Author:</strong> {post.author}</p>
            <p><strong>Posted on:</strong> {new Date(post.createdAt).toLocaleString()}</p>
            <button>View Comments</button>
          </div>
        ))
      )}
    </div>
  );
};

export default PostsPage;
