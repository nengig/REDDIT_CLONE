// PostsForm.jsx
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useGetPostByIdQuery,
} from './features/api/apiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PostsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get post ID if in edit mode
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    author: '',
    title: '',
    body: '',
  });

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const { data: postData, isLoading: loadingPost } = useGetPostByIdQuery(id, {
    skip: !isEdit,
  });

  useEffect(() => {
    if (postData) {
      setForm({
        author: postData.author || '',
        title: postData.title || '',
        body: postData.body || '',
      });
    }
  }, [postData]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      await updatePost({ id, ...form });
    } else {
      await createPost(form);
    }

    navigate(-1); // Go back to previous page
  };

  if (isEdit && loadingPost) return <p className="text-white px-6">Loading post data...</p>;

  return (
    <div className="px-6 py-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-2xl mx-auto bg-reddit_dark-brighter p-6 rounded-md border border-reddit_border text-white"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {isEdit ? 'Edit Post' : 'Create Post'}
        </h2>

        <input
          type="text"
          name="author"
          placeholder="Your name"
          className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
          value={form.author}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="title"
          placeholder="Post title"
          className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="body"
          placeholder="Write your post..."
          className="w-full bg-gray-800 border border-gray-700 p-2 rounded h-40"
          value={form.body}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-reddit_orange hover:bg-orange-600 text-white py-2 px-6 rounded"
        >
          {isEdit ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostsForm;
