import React from 'react';
import { useGetPostsQuery } from './features/api/apiSlice'; // Assuming you're using RTK Query for fetching posts
import PostDetails from './PostDetails'; // This will be the component for rendering each individual post

const PostList = () => {
  const { data: posts, isLoading, isError } = useGetPostsQuery(); // Fetch all posts

  // Handle loading state
  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  // Handle error state
  if (isError) {
    return <div>Error loading posts!</div>;
  }

  // Handle case where no posts are available
  if (!posts || posts.length === 0) {
    return <div>No posts available.</div>;
  }

  return (
    <div className="post-list px-6">
      {posts.map((post) => (
        <PostDetails key={post._id} post={post} /> // Render each individual post
      ))}
    </div>
  );
};

export default PostList;
