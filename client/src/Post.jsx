import React from 'react';
import { Link } from 'react-router-dom';

const Post = ({ post }) => {
  if (!post) return null;

  return (
    <div className="border border-reddit_border bg-reddit_dark-brighter p-4 mb-4 rounded-md">
      <h3 className="text-xl font-semibold mb-2">
        <Link to={`/post/${post._id}`} className="text-reddit_text hover:underline">
          {post.title}
        </Link>
      </h3>

      <p className="text-sm text-reddit_text-darker mb-2">
        Posted by u/{post.author} • {new Date(post.postedAt).toLocaleString()}
      </p>

      <p className="text-reddit_text text-sm">
        {post.body?.slice(0, 200)}{post.body?.length > 200 && '...'}
      </p>
    </div>
  );
};

export default Post;
