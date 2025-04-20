import React from 'react';
import { useDeletePostMutation } from './features/api/apiSlice';
import { Link, useNavigate } from 'react-router-dom';

const Post = ({ post, fullView = false }) => {
    const [deletePost] = useDeletePostMutation();
    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirmDelete = confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) return;
        try {
            await deletePost(post._id);
            navigate('/');
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    }

    if (!post) return <div>Post not found</div>; // In case there's no post data available

    const formattedDate = new Date(post.postedAt).toLocaleString();  // Handle the date correctly

    return (
        <div className="border border-reddit_border bg-reddit_dark-brighter p-4 mb-4 rounded-md">
            <h1 className="text-2xl font-bold text-reddit_text mb-3">
                {post.title}
            </h1>

            <p className="text-sm text-reddit_text-darker mb-4">
                Posted by u/{post.author} • {formattedDate}
            </p>

            <p className="text-reddit_text text-base leading-relaxed">
                {fullView ? post.body : `${post.body?.slice(0, 200)}${post.body?.length > 200 ? '...' : ''}`}
                {/* Conditionally render the full post body */}
            </p>

            {/* Example buttons (optional) */}
            {fullView && (
                <div className="mt-4 flex space-x-4">
                    <Link
                        to={`/edit-post/${post._id}`}
                        className="inline-block bg-blue-600 hover:bg-blue-500 text-white py-1 px-3 rounded text-sm"
                    >
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 text-sm">
                            Edit
                        </button>
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 text-sm">
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default Post;
