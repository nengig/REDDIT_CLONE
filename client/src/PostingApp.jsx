import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PostingApp = () => {
  const [posts, setPosts] = useState([]);

  // Fetch posts when the component is mounted
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="app">
      <h1>All Posts</h1>
      <Link to="/create-post">
        <button>Create New Post</button>
      </Link>

      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="post-item">
              <h2>
                <Link to={`/post/${post._id}`}>{post.title}</Link>
              </h2>
              <p>{post.content}</p>
              <small>By {post.author}</small>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default PostingApp;
