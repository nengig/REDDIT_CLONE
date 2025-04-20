import React from 'react';
import PostList from './PostList';

const PostingApp = () => {
  return (
    <div className="bg-reddit_dark min-h-screen py-6">
      <h1 className="text-2xl text-white font-semibold px-6 mb-4">r/YourSubreddit</h1>
      <PostList />
    </div>
  );
};

export default PostingApp;
