import React, { useState, useEffect } from 'react';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [selectedPost, setSelectedPost] = useState(null);

  // fetch posts
  useEffect(() => {
    fetch('http://localhost:5000/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  // form changes for creating a post
  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  // creating a new post
  const handlePostSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then((data) => {
        // add new posts to the front of the list
        setPosts([data, ...posts]);
        setNewPost({ title: '', content: '' });
      })
      .catch((error) => console.error('Error creating post:', error));
  };

  return (
    <div className="App">
      <header>
        <h1>Boppit :)</h1>
      </header>
      {/* post form */}
      <div className="create-post">
        <h2>Create a New Post</h2>
        <form onSubmit={handlePostSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={newPost.title}
            onChange={handlePostChange}
          />
          <textarea
            name="content"
            placeholder="Post Content"
            value={newPost.content}
            onChange={handlePostChange}
          />
          <button type="submit">Create Post</button>
        </form>
      </div>

      {/* post list */}
      <div className="post-list">
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to create one!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>

              {/* comment toggle */}
              <button onClick={() => setSelectedPost(post.id)}>
                {selectedPost === post.id ? 'Hide Comments' : 'Show Comments'}
              </button>

              {/* comment dispyaly */}
              {selectedPost === post.id && (
                <div className="comments-section">
                  <h4>Comments</h4>
                  <ul>
                    {post.comments.length === 0 ? (
                      <li>No comments yet.</li>
                    ) : (
                      post.comments.map((comment) => (
                        <li key={comment.id}>
                          <strong>{comment.author}:</strong> {comment.content}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default App;
