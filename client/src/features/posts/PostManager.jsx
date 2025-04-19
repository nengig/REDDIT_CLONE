// import { useState } from 'react';
// import {
//   useGetPostsQuery,
//   useCreatePostMutation,
//   useUpdatePostMutation,
//   useDeletePostMutation,
// } from '../api/apiSlice';

// export default function PostManager() {
//   const { data: posts, isLoading, isError } = useGetPostsQuery();
//   const [createPost] = useCreatePostMutation();
//   const [updatePost] = useUpdatePostMutation();
//   const [deletePost] = useDeletePostMutation();

//   const [form, setForm] = useState({ author: '', title: '', body: '' });
//   const [editingPostId, setEditingPostId] = useState(null);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     await createPost(form);
//     setForm({ author: '', title: '', body: '' });
//   };

//   const handleUpdate = async (post) => {
//     await updatePost({ id: post._id, title: form.title, body: form.body });
//     setEditingPostId(null);
//     setForm({ author: '', title: '', body: '' });
//   };

//   if (isLoading) return <p>Loading posts...</p>;
//   if (isError) return <p>Error loading posts</p>;

//   return (
//     <div className="p-6 space-y-6">
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Create Post</h2>
//         <form onSubmit={handleCreate} className="space-y-4">
//           <input
//             name="author"
//             value={form.author}
//             onChange={handleChange}
//             placeholder="Author"
//             required
//             className="w-full p-2 rounded bg-gray-800 text-white border border-reddit_border"
//           />
//           <input
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             placeholder="Title"
//             required
//             className="w-full p-2 rounded bg-gray-800 text-white border border-reddit_border"
//           />
//           <textarea
//             name="body"
//             value={form.body}
//             onChange={handleChange}
//             placeholder="Body"
//             required
//             className="w-full p-2 rounded bg-gray-800 text-white border border-reddit_border"
//           />
//           <button
//             type="submit"
//             className="w-full bg-reddit_orange text-white py-2 rounded font-semibold hover:bg-orange-600"
//           >
//             Create
//           </button>
//         </form>
//       </div>

//       <hr className="border-reddit_border" />

//       <div>
//         <h2 className="text-xl font-semibold mb-4">Posts</h2>
//         <div className="space-y-4">
//           {posts.map((post) => (
//             <div
//               key={post._id}
//               className="border border-reddit_border bg-reddit_dark-brighter p-4 rounded-md space-y-4"
//             >
//               {editingPostId === post._id ? (
//                 <>
//                   <input
//                     name="title"
//                     value={form.title}
//                     onChange={handleChange}
//                     placeholder="Title"
//                     className="w-full p-2 rounded bg-gray-800 text-white border border-reddit_border"
//                   />
//                   <textarea
//                     name="body"
//                     value={form.body}
//                     onChange={handleChange}
//                     placeholder="Body"
//                     className="w-full p-2 rounded bg-gray-800 text-white border border-reddit_border"
//                   />
//                   <button
//                     onClick={() => handleUpdate(post)}
//                     className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => setEditingPostId(null)}
//                     className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600"
//                   >
//                     Cancel
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <h3 className="text-xl font-semibold">{post.title}</h3>
//                   <p>{post.body}</p>
//                   <p className="text-sm text-gray-400">by {post.author}</p>
//                   <button
//                     onClick={() => {
//                       setEditingPostId(post._id);
//                       setForm({ title: post.title, body: post.body });
//                     }}
//                     className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deletePost(post._id)}
//                     className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500"
//                   >
//                     Delete
//                   </button>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
