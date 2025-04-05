import { useState } from "react";

import Button from "./Button";
import TextArea from "./TextArea";

function CommentForm(props) {
    const [commentBody, setCommentBody] = useState("");

    const postComment = async (e) => {
        e.preventDefault();
        const newComment = { 
            author: "test",
            postedAt: new Date(),
            body: commentBody, 
            parentId: `${props.parentId}`,
            rootId: `${props.rootId}`, 
        };
        console.log(newComment);


        const response = await fetch("http://localhost:8000/comment/comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newComment)
        });

        const result = await response.json();
        console.log(result);
        setCommentBody("");
        if (props.onSubmit){
            props.onSubmit();
        }
    }

    return (
        <div className={'text-reddit_text'}>
            {props.showAuthor &&
                < div className="mb-2">
                    Comment as userInfo.username
                </div>
            }
            <form onSubmit={postComment}>
                <TextArea className="w-full text-white mb-3 border border-reddit_border"
                    onChange={e => setCommentBody(e.target.value)}
                    value={commentBody}
                    placeholder={'Your comment.'} />
                <div className="text-right">
                    {!!props.onCancel && (
                        <Button outline className="mr-2 p-1" onClick={(e) => props.onCancel()}>Cancel</Button>
                    )}
                    <Button className="p-1">Comment</Button>
                </div>
            </form>
        </div >
    )
}

export default CommentForm;