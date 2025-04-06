import { useState, useEffect, useContext } from "react";

import CommentForm from "./CommentForm";
import Comments from "./Comments";
import RootCommentContext from "./RootCommentContext";
import UserContext from "./UserContext";
import AuthModalContext from "./AuthModalContext";
import { PlusIcon } from '@heroicons/react/24/outline';



function CommentsPage(props) {

    const userInfo = useContext(UserContext)
    const [comments, setComments] = useState([]);
    const [commentVotes, setCommentVotes] = useState({});
    const [userVotes, setUserVotes] = useState({});

    const authModal = useContext(AuthModalContext);


    const fetchCommentsByParentId = async () => {
        const postid = 1234;
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}comment/all/${postid}`);

        if (!response.ok) {
            // If the response is not OK (e.g., 400 or 500), throw an error
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch comments");
        }


        const data = await response.json();
        setComments(data);

    }

    const refreshVotes = async () => {
        const commentIds = comments.map(c => c.commentId);
        console.log(commentIds);
        console.log(comments);
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}comment/votes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment_ids: commentIds })
        });

        if (!response.ok) {
            // If the response is not OK (e.g., 400 or 500), throw an error
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch votes");
        }

        console.log(response);
        const data = await response.json();
        console.log("--");
        console.log(data.body.comment_totals);
        setCommentVotes(data.body.comment_totals);
        setUserVotes(data.body.userVotes);
    }

    useEffect(() => {
        fetchCommentsByParentId();
    }, []);

    // Run refreshVotes AFTER comments are updated
    useEffect(() => {
        if (comments.length > 0) {
            refreshVotes();
        }
    }, [comments.length]);


    const handleAddComment = () => {
        authModal.setShow('login');
    }


    return (
        // <div className="block overflow-scroll" style={{ maxHeight: "calc(100vh - 50px" }}>
        <div className="block">
            {/* <PostContent open={true} {...comment} /> */}
            {/* {!!comment && !!comment._id && {} */}
            <hr className="border-reddit_border my-4" />
            {
                userInfo.username ?
                    (<>
                        {/* <CommentForm rootId={Comment._id} parentId={Comment._id}/> */}
                        <CommentForm rootId={"123abc"}
                            parentId={"124def"}
                            showAuthor={true}
                            onSubmit={() => fetchCommentsByParentId()} /></>
                    ) : (
                        <button className="w-full xs:w-auto button-medium  items-center justify-left button inline-flex cursor-pointer" onClick={handleAddComment}>
                            <span className="flex items-center border-1 border-white  justify-center pr-4 rounded-full py-2">
                                <PlusIcon className="text-white-400 w-6 h-6 mx-2" />
                                <span className="flex items-center ">Add a comment</span>
                            </span>
                        </button>
                    )
            }
            <hr className="border-reddit_border my-4" />
            {/* <Comments parentId={postId}/> */}
            <RootCommentContext.Provider value={{
                refreshComments: fetchCommentsByParentId,
                // refreshVotes: refreshVotes,
                // commentsTotals: commentVotes,
                // userVotes: userVotes
            }} >
                <Comments parentId={null} comments={comments} rootId={'67ef1005ca7a80336f890bcc'} />
            </RootCommentContext.Provider>
        </div>
    )
}

export default CommentsPage;