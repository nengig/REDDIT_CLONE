import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // For getting the post ID from the URL

const PostDetails = () => {
  const { id } = useParams();  // Get the ID from the URL
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  // Fetch the post data from the backend
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/posts/${id}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        setError('Error fetching post');
        console.error(error);
      }
    };

    fetchPost();
  }, [id]);  // The effect will run when the ID changes (i.e., when the user clicks on a different post)

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-page">
      <h1>{post.title}</h1>
      <p><strong>Author:</strong> {post.author}</p>
      <p><strong>Created at:</strong> {new Date(post.createdAt).toLocaleString()}</p>
      <div>
        <strong>Content:</strong>
        <p>{post.content}</p>
      </div>
      <h3>Comments</h3>
      {post.comments && post.comments.length > 0 ? (
        <ul>
          {post.comments.map((comment, index) => (
            <li key={index}>
              <strong>{comment.author}</strong>: {comment.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default PostDetails;
