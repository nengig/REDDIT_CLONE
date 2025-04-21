import React from 'react';
import { useGetPostsQuery } from './features/api/apiSlice';
// rendering posts
import PostDetails from './PostDetails'; 

const PostList = () => {
  const { data: posts, isLoading, isError } = useGetPostsQuery(); // Fetch all posts

  console.log("posts - ", isLoading);
  console.log(posts);

  // console.log("data");
  // console.log(data);

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
    <div className="post-list pl-4 w-2/3">
      {posts.map((post) => (
        <PostDetails key={post._id} post={post} from="home"/> // Render each individual post
      ))}
    </div>
  );
};

export default PostList;
