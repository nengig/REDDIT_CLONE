import React from 'react';
import { Link } from 'react-router-dom';

const PostDetails = ({ post }) => {
  if (!post) return null;

  return (
    <div className="post-item border-b border-reddit_border bg-reddit_dark-brighter p-4 mb-4 rounded-md hover:bg-reddit_dark-brightest transition">
      {/* Entire card links to the post page */}
      <Link to={`/post/${post._id}`} className="block mb-2">
        <h3 className="text-xl font-semibold text-reddit_text mb-1">
          {post.title}
        </h3>
        <p className="text-sm text-reddit_text-darker mb-1">
          Posted by u/{post.author} • {new Date(post.postedAt).toLocaleString()}
        </p>
        <p className="text-sm text-reddit_text">
          {post.body?.slice(0, 200)}{post.body?.length > 200 && '...'}
        </p>
      </Link>

      {/* Edit button (placed outside the clickable area of the post link) */}
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
