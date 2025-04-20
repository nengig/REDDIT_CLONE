import React from 'react';

const Post = ({ post, fullView = false }) => {
  if (!post) return <div>Post not found</div>; // In case there's no post data available

  const formattedDate = new Date(post.postedAt).toLocaleString();  // Handle the date correctly

  return (
    <div className="border border-reddit_border bg-reddit_dark-brighter p-4 mb-4 rounded-md">
      <h1 className="text-2xl font-bold text-reddit_text mb-3">
        {post.title}
      </h1>

      <p className="text-sm text-reddit_text-darker mb-4">
        Posted by u/{post.author} • {formattedDate} {/* Ensure the date is formatted correctly */}
      </p>

      <p className="text-reddit_text text-base leading-relaxed">
        {fullView ? post.body : `${post.body?.slice(0, 200)}${post.body?.length > 200 ? '...' : ''}`}
        {/* Conditionally render the full post body */}
      </p>

      {/* Example buttons (optional) */}
      {fullView && (
        <div className="mt-4 flex space-x-4">
          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 text-sm">
            Edit
          </button>
          <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 text-sm">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Post;
