import { useState, useEffect, useContext } from 'react';

import Avatar from './avatar.png'
import TimeAgo from 'timeago-react';
import Button from './Button';
import CommentForm from './CommentForm';
import RootCommentContext from './RootCommentContext';
import no_comments_logo from "./images/no_comments.png";

import { ChatBubbleOvalLeftIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Voting from './Voting';
import UserContext from './UserContext';
import AuthModalContext from "./AuthModalContext";
import { Link } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';

function Comments(props) {

    const authModal = useContext(AuthModalContext);

    const [showReplyCommentForm, setShowReplyCommentForm] = useState(false);
    const [editComment, setEditComment] = useState(false);
    const comments = props.comments.filter(comment => props.parentId == comment.parentId);

    const rootCommentInfo = useContext(RootCommentContext);
    const userInfo = useContext(UserContext);


    const [modalOpen, setModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // comments/:id

    const deleteComment = () => {
        setDeleteTarget({ type: 'comment' });
        setModalOpen(true);

    }
    const onConfirmDelete = async (commentId) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}comment/comments/${commentId}`, {
                method: "DELETE",
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error("Failed to delete comment");
            }

            const data = await res.json();
            console.log(data);
            rootCommentInfo.refreshComments();
        } catch (err) {
            console.error(err);
        }

        setModalOpen(false);
        setDeleteTarget(null);

    }


    return (
        <div className={'my-2 text-reddit_text'}>

            {comments.length > 0 ? comments.map(comment => {

                const replies = props.comments.filter(c => c.parentId == comment._id);

                return (
                    <div key={comment._id} className='mb-2'>
                        <div className="flex mb-0">

                            {comment.userId != null ? (
                                <div className="flex mb-0">
                                    <Link to={comment.userId.username == userInfo.username ? '/profile' : `/u/${comment.userId.username}`} className="flex mb-0">
                                        <div className="overflow-hidden bg-reddit_text w-10 h-10 rounded-full mr-2">
                                            <img src={Avatar} alt="" className="block w-full h-full object-cover" />
                                        </div>
                                        <div className="leading-10 pr-2 text-lg font-sans">u/{comment.userId.username} </div>

                                    </Link>
                                    <TimeAgo className="leading-10 pr-2 text-md font-sans" datetime={comment.createdAt} />
                                </div>
                            ) : (
                                <div className="flex mb-0">
                                    <div className='bg-reddit_text w-10 h-10 rounded-full mr-2'></div>
                                    <div className="leading-10 pr-2 text-lg font-sans">{comment.userId != null ? "u/" + comment.userId.username : "[deleted]"}</div>
                                    <TimeAgo className="leading-10 pr-2 text-md font-sans" datetime={comment.createdAt} />
                                </div>
                            )}

                        </div>
                        <div className='border-l-2 border-gray-700 px-3' style={{ marginLeft: '18px' }}>
                            <div className='pl-4 mt-0'>
                                <div>
                                    {comment._id === editComment ? (
                                        <CommentForm
                                            value={comment.content}
                                            editing={true}
                                            parentId={comment._id}
                                            rootId={props.rootId}
                                            onSubmit={
                                                () => {
                                                    setEditComment(false);
                                                    rootCommentInfo.refreshComments();
                                                }}
                                            showAuthor={false}
                                            onCancel={e => setEditComment(false)}
                                        />
                                    ) :
                                        comment.content
                                    }
                                </div>
                                <div className='flex'>
                                    <Voting parentId={comment._id} for="Comment" disabled={comment.deleted} postDeleted={props.disabled} />
                                    <Button type={'button'}

                                        onClick={() => {
                                            if (userInfo?.username) {
                                                setShowReplyCommentForm(comment._id)
                                            }
                                            else {
                                                authModal.setShow('login');
                                            }
                                        }
                                        }
                                        className={`bg-reddit_dark-brighter text-reddit_text-darker border-0 pl-0 pr-0 py-2 flex items-center ${(!comment.deleted || !props.AuthModalContextdisabled) && " cursor-pointer  disabled:cursor-not-allowed"}`}
                                        disabled={comment.deleted || props.disabled}
                                        title={userInfo?.username != comment?.userId?.username ? "You can't reply to deleted comment" : "Reply"}
                                    >
                                        <ChatBubbleOvalLeftIcon className='w-5 h-5' />
                                        Reply
                                    </Button>

                                    {!comment.deleted && userInfo.username == comment?.userId?.username && (
                                        <div className='flex'>
                                            <button className="flex items-center mx-2 text-reddit_text-darker cursor-pointer  disabled:cursor-not-allowed" onClick={() => setEditComment(comment._id)} disabled={comment.deleted || props.disabled}>
                                                <PencilSquareIcon className="w-5 h-5 ml-2 mr-1 hover:text-gray-500" />
                                                Edit
                                            </button>
                                            <button onClick={() => deleteComment(comment._id)} className="flex items-center  mx-2">
                                                <TrashIcon className="w-5 h-5 text-[#d93900]  hover:text-red-700 cursor-pointer" />
                                            </button>

                                            <ConfirmModal
                                                isOpen={modalOpen}
                                                onClose={() => setModalOpen(false)}
                                                onConfirm={() => onConfirmDelete(comment._id)}
                                                message={`Are you sure you want to delete your ${deleteTarget?.type}? This cannot be undone.`}
                                            />
                                        </div>
                                    )}
                                </div>

                                {comment._id === showReplyCommentForm && (
                                    <CommentForm
                                        parentId={comment._id}
                                        editing={false}
                                        rootId={props.rootId}
                                        onSubmit={
                                            () => {
                                                setShowReplyCommentForm(false);
                                                rootCommentInfo.refreshComments();
                                            }}
                                        showAuthor={false}
                                        onCancel={e => setShowReplyCommentForm(false)}
                                    />
                                )}

                                {
                                    replies.length > 0 && (
                                        <Comments comments={props.comments} parentId={comment._id} rootId={props.rootId} disabled={props.disabled} />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )
            }) :
                <>
                    <div className="flex px-md py-lg px-10 pb-20 pt-5">
                        <div className="grow shrink-0 basis-l mr-10">
                            <img src={no_comments_logo} alt="Thinking Snoo" className="mb-0 h-30" loading="lazy" /></div>
                        <div className="basis-full">
                            <p className="text-18 font-semibold m-0 mb-3 mt-3">
                                Be the first to comment
                            </p>
                            <p className="text-tone-2 m-0">
                                Nobody's responded to this post yet.
                                <br />
                                Add your thoughts and get the conversation going.
                            </p>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Comments;

