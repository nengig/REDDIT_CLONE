import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !author) {
      setError('All fields are required!');
      return;
    }

    const newPost = { title, content, author };

    try {
      const response = await fetch('http://localhost:8000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      
      if (response.ok) {
        // Clear the form and navigate to the posts list page
        setTitle('');
        setContent('');
        setAuthor('');
        setError('');
        navigate('/posts'); // Navigate to the posts list page after success
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create post');
      }
    } catch (error) {
      setError('Error connecting to the server');
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="create-post-page">
      <h1>Create a New Post</h1>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title"
          />
        </div>

        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter the content"
          />
        </div>

        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePostPage;
