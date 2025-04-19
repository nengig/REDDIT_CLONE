import React from 'react';
import { Link } from 'react-router-dom'; // For navigating to individual post page

const PostDetails = ({ post }) => {
  return (
    <div className="post-item border-b border-reddit_border bg-reddit_dark-brighter p-4 mb-4 rounded-md">
      <h3 className="text-xl font-semibold mb-2">
        <Link to={`/post/${post._id}`} className="text-reddit_text">
          {post.title}
        </Link>
      </h3>
      <p className="text-sm text-reddit_text-darker mb-2">
        Posted by u/{post.author} {new Date(post.postedAt).toLocaleString()}
      </p>
      <p className="text-sm text-reddit_text">{post.body.slice(0, 200)}...</p>
      {/* Edit Button */}
      <Link
        to={`/edit-post/${post._id}`}
        className="inline-block bg-blue-600 hover:bg-blue-500 text-white py-1 px-3 rounded text-sm"
      >
        Edit
      </Link>
    </div>
  );
};

export default PostDetails;
