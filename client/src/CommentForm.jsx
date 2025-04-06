import { useContext, useState } from "react";

import Button from "./Button";
import TextArea from "./TextArea";
import UserContext from "./UserContext";

function CommentForm(props) {
    const [commentBody, setCommentBody] = useState("");
    const userInfo = useContext(UserContext);

    const postComment = async (e) => {
        e.preventDefault();

        console.log(userInfo);
        const newComment = {
            postId: props.rootId,
            parentId: props.parentId, //comment's parent comment's id
            content: commentBody,
        };
        console.log(newComment);


        const response = await fetch("http://localhost:8000/comment/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(newComment)
        });

        if (!response.ok) {
            // If the response is not OK (e.g., 400 or 500), throw an error
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create comment");
        }

        const result = await response.json();
        console.log(result);
        setCommentBody("");
        if (props.onSubmit) {
            props.onSubmit();
        }
    }

    return (
        <div className={'text-reddit_text'}>
            {props.showAuthor &&
                < div className="mb-2">
                    Comment as {userInfo.username}
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