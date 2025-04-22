import React, { useContext, useEffect, useState } from 'react';
import { useDeletePostMutation } from './features/api/apiSlice';
import { Link, useNavigate } from 'react-router-dom';
import TimeAgo from 'timeago-react';
import CommentsPage from './CommentsPage';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import UserContext from './UserContext';
import Voting from './Voting';
import ConfirmModal from './ConfirmModal';

const Post = ({ post, fullView = false }) => {
    const [deletePost] = useDeletePostMutation();
    const navigate = useNavigate();
    const [communityName, setCommunityName] = useState();

    const userInfo = useContext(UserContext);

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDelete = async () => {
        setDeleteTarget({ type: 'post' });
        setModalOpen(true);
    }


    const onConfirmDelete = async () => {
        if (deleteTarget?.type === 'post') {
            try {
                await deletePost(post._id);
                navigate('/');
            }
            catch (err) {
                setError(err.response?.data?.error || 'Account deletion failed');
            }

            setModalOpen(false);
            setDeleteTarget(null);

        }
    }


    const getCommunityInfo = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}community/id/${post.communityId}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await res.json();
            setCommunityName("r/" + data.name);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }

    useEffect(() => {
        getCommunityInfo();
    }, [])

    if (!post) return <div>Post not found</div>; // In case there's no post data available

    const formattedDate = new Date(post.postedAt).toLocaleString();  // Handle the date correctly


    return (
        <div className="border border-reddit_border bg-reddit_dark-brighter p-4 mb-4 rounded-md max-w-full overflow-hidden  relative xl:right-35">
            <div className="flex justify-between items-center w-full mb-2">
                <div className="flex items-start space-x-2 w-full">
                    <div className="shrink-0 w-[10px] h-[10px] md:w-10 md:h-10 rounded-full bg-green-600 flex items-center justify-center shadow text-white text-md font-bold">
                        r/
                    </div>
                    <div>
                        <Link to={`/${communityName}`} ><p className='text-sm font-bold'>{communityName}</p></Link>
                        <Link to={post.author == `u/${userInfo.username}` ? '/profile' : `/${post.author}`} ><p className='text-xs'>{post.author}</p></Link>
                    </div>
                    <h5 className="text-reddit_text-darker text-sm">
                        •{' '}
                        <TimeAgo
                            className="text-sm font-sans text-gray-500"
                            datetime={post.createdAt}
                        />
                    </h5>
                </div>

                {`u/${userInfo.username}` == post.author && (
                    <div className='flex'>
                        <Link to={`/edit-post/${post._id}`} className="flex items-center mx-2">
                            <PencilSquareIcon className="w-5 h-5  text-reddit_text-darker  hover:text-gray-500 cursor-pointer" />
                        </Link>
                        <button onClick={handleDelete} className="flex items-center  mx-2">
                            <TrashIcon className="w-5 h-5 text-[#d93900]  hover:text-red-700 cursor-pointer" />
                        </button>

                        <ConfirmModal
                            isOpen={modalOpen}
                            onClose={() => setModalOpen(false)}
                            onConfirm={onConfirmDelete}
                            message={`Are you sure you want to delete your ${deleteTarget?.type}? This cannot be undone.`}
                        />
                    </div>
                )}
            </div>

            {/* Title Section */}
            <h2 className="text-xl mb-3 break-words">{post.title}</h2> {/* Use break-words to prevent overflow */}

            {/* Body Section */}
            <div className="text-sm leading-6 break-words">
                <p>
                    {post.body}
                </p>

                <div className='block border-t border-reddit_border mt-5'>
                    <Voting parentId={post._id} for="Posts" disabled={post.deleted} postDeleted={false} />
                </div>
                <CommentsPage postId={post._id} disabled={post.deleted ? post.deleted : false} />
            </div>
        </div>

    )
};

export default Post;
