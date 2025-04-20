import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Post from './Post';  // Assuming this is the correct Post component

const PostPage = () => {
  const { id } = useParams();  // Get the post ID from the URL params
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the post data by ID
    axios.get(`${import.meta.env.VITE_SERVER_URL}posts/${id}`)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.error('❌ Error loading post:', err);
        setError('Could not load post');
      });
  }, [id]);  // Fetch again if the ID changes (useParams will give the new ID)

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!post) return <div className="p-6">Loading post...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Post post={post} fullView /> {/* Pass the post to the Post component with fullView */}
    </div>
  );
};

export default PostPage;
