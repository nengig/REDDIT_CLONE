import { useState, useEffect, useContext } from 'react';

import TimeAgo from 'timeago-react';
import Button from './Button';
import CommentForm from './CommentForm';
import RootCommentContext from './RootCommentContext';
import no_comments_logo from "./images/no_comments.png";

import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import Voting from './Voting';

function Comments(props) {

    const [showReplyCommentForm, setShowReplyCommentForm] = useState(false);
    const comments = props.comments.filter(comment => props.parentId == comment.parentId);

    const rootCommentInfo = useContext(RootCommentContext);
    

    return (
        <div className={'my-2 text-reddit_text'}>

            {comments.length > 0 ? comments.map(comment => {

                const replies = props.comments.filter(c => c.parentId == comment._id);

                return (
                    <div key={comment._id} className='mb-2'>
                        <div className="flex mb-0">
                            <div className='bg-reddit_text w-10 h-10 rounded-full mr-2'></div>
                            <div className="leading-10 pr-2 text-lg font-sans">{comment.userId != null ? comment.userId.username : "null"}</div>
                            <TimeAgo className="leading-10 pr-2 text-md font-sans" datetime={comment.createdAt} />
                        </div>
                        <div className='border-l-2 border-reddit_text-darker px-3' style={{ marginLeft: '18px' }}>
                            <div className='pl-4 mt-0'>
                                <div>{comment.content}</div>
                                <div className='flex'>
                                    <Voting parentId={comment._id} for="Comment" />
                                    <Button type={'button'}
                                        onClick={() => setShowReplyCommentForm(comment._id)}
                                        className="bg-reddit_dark-brighter text-reddit_text-darker border-0 pl-0 pr-0 py-2 flex items-center">
                                        <ChatBubbleOvalLeftIcon className='w-5 h-5' />
                                        Reply</Button>
                                </div>

                                {comment._id === showReplyCommentForm && (
                                    <CommentForm
                                        parentId={comment._id}
                                        rootId={props.postId}
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
                                        <Comments comments={props.comments} parentId={comment._id} rootId={props.postId} />
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

