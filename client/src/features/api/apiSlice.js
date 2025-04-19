import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const port = import.meta.env.VITE_API_PORT || 8000;
const baseUrl = `http://localhost:${port}/api`;

export const redditApi = createApi({
  reducerPath: 'redditApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => 'posts', // Assuming this endpoint fetches a list of posts
      providesTags: ['Post'],
    }),
    getPostById: builder.query({
      query: (id) => `posts/${id}`, // Get individual post by ID
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: 'posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Post'],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...updatedFields }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body: updatedFields,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = redditApi;
