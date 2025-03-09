import { useState, useEffect, useContext } from 'react';

import TimeAgo from 'timeago-react';
import Button from './Button';
import CommentForm from './CommentForm';
import RootCommentContext from './RootCommentContext';

import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';
import Voting from './Voting';

function Comments(props) {

    const [showReplyCommentForm, setShowReplyCommentForm] = useState(false);
    const comments = props.comments.filter(comment => props.parentId === comment.parentId);
    const rootCommentInfo = useContext(RootCommentContext);



    return (
        <div className={'my-2 text-reddit_text'}>

            {comments.map(comment => {

                const replies = props.comments.filter(c => c.parentId === comment.commentId);

                return (
                    <div key={comment.commentId} className='mb-2'>
                        <div className="flex mb-0">
                            <div className='bg-reddit_text w-10 h-10 rounded-full mr-2'></div>
                            <div className="leading-10 pr-2 text-lg font-sans">{comment.author}</div>
                            <TimeAgo className="leading-10 pr-2 text-md font-sans" datetime={comment.postedAt} />
                        </div>
                        <div className='border-l-2 border-reddit_text-darker px-3' style={{ marginLeft: '18px' }}>
                            <div className='pl-4 mt-0'>
                                <div>{comment.body}</div>
                                <div className='flex'>
                                    <Voting commentId={comment.commentId}/>
                                    <Button type={'button'}
                                        onClick={() => setShowReplyCommentForm(comment.commentId)}
                                        className="bg-reddit_dark-brighter text-reddit_text-darker border-0 pl-0 pr-0 py-2 flex items-center">
                                        <ChatBubbleOvalLeftIcon className='w-5 h-5' />
                                        Reply</Button>
                                </div>

                                {comment.commentId === showReplyCommentForm && (
                                    <CommentForm
                                        parentId={comment.commentId}
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
                                        <Comments comments={props.comments} parentId={comment.commentId} rootId={props.rootId} />
                                    )
                                }
                                {/* {replies.length > 0 && (
                                    <Comments comments={props.comments} parentId={comment.commentId} />
                                    // <Comments comments={replies} parentId={comment.commentId} />
                                )} */}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Comments;

