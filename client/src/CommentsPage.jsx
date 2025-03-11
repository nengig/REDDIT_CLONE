import { useState, useEffect } from "react";

import CommentForm from "./CommentForm";
import Comments from "./Comments";
import RootCommentContext from "./RootCommentContext";




function CommentsPage(props) {


    const [comments, setComments] = useState([]);
    const [commentVotes, setCommentVotes] = useState({});
    const [userVotes, setUserVotes] = useState({});

    // const visibleClass = props.open ? 'block' : 'hidden';


    const fetchData = async () => {

        const response = await fetch("http://localhost:8000/comment/comments");
        const data = await response.json();
        setComments(data);
        // console.log("Fetched atat");
        // refreshVotes();
    }


    const fetchCommentsByParentId = async () => {
        //with post id
        const response = await fetch("http://localhost:8000/comment/comments");
        const data = await response.json();
        setComments(data);

    }

    const refreshVotes = async () => {
        const commentIds = comments.map(c => c.commentId);
        console.log(commentIds);
        console.log(comments);
        const response = await fetch(`http://localhost:8000/comment/votes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment_ids: commentIds })
        });
        console.log(response);
        const data = await response.json();
        console.log("--");
        console.log(data.body.comment_totals);
        setCommentVotes(data.body.comment_totals);
        setUserVotes(data.body.userVotes);
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Run refreshVotes AFTER comments are updated
    useEffect(() => {
        if (comments.length > 0) {
            refreshVotes();
        }
    }, [comments.length]);


    return (
        <div className="block overflow-scroll" style={{ maxHeight: "calc(100vh - 50px" }}>
            {/* <PostContent open={true} {...comment} /> */}
            {/* {!!comment && !!comment._id && {} */}
            <hr className="border-reddit_border my-4" />
            {/* <CommentForm rootId={Comment._id} parentId={Comment._id}/> */}
            <CommentForm rootId={0}
                parentId={1}
                showAuthor={true}
                onSubmit={() => fetchData()} />
            <hr className="border-reddit_border my-4" />
            {/* <Comments parentId={postId}/> */}
            <RootCommentContext.Provider value={{
                refreshComments: fetchCommentsByParentId,
                refreshVotes: refreshVotes,
                commentsTotals: commentVotes,
                userVotes: userVotes
            }} >
                <Comments parentId={'1'} comments={comments} rootId={'0'} />
            </RootCommentContext.Provider>
        </div>
    )
}

export default CommentsPage;