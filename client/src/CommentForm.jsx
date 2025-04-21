import { useContext, useState } from "react";

import Button from "./Button";
import TextArea from "./TextArea";
import UserContext from "./UserContext";

function CommentForm(props) {
    const [commentBody, setCommentBody] = useState(props.value ? props.value : "");
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

        console.log(props.editing);


        let response;
        if (props.editing) {
            response = await fetch(`${import.meta.env.VITE_SERVER_URL}comment/${props.parentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({content: newComment.content})
            })
        } else {
            response = await fetch(`${import.meta.env.VITE_SERVER_URL}comment/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(newComment)
            })
        }

        if (!response.ok) {
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
                <TextArea className="w-full text-white mb-3 border border-reddit_border disabled:text-gray-500 disabled:cursor-not-allowed"
                    onChange={e => setCommentBody(e.target.value)}
                    value={commentBody}
                    disabled={props.disabled}
                    placeholder={'Your comment.'} />
                <div className="text-right">
                    {!!props.onCancel && (
                        <Button outline className="mr-2 p-1" onClick={(e) => props.onCancel()}>Cancel</Button>
                    )}
                    <Button className={`p-1 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`} disabled={props.disabled}>{props.editing ? "Update" : "Comment"}</Button>
                </div>
            </form>
        </div >
    )
}

export default CommentForm;