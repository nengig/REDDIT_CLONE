import { useState, useEffect, useContext } from "react";

import CommentForm from "./CommentForm";
import Comments from "./Comments";
import RootCommentContext from "./RootCommentContext";
import UserContext from "./UserContext";
import AuthModalContext from "./AuthModalContext";
import { PlusIcon } from '@heroicons/react/24/outline';



function CommentsPage(props) {

    const postId = props.postId;

    const userInfo = useContext(UserContext)
    const [comments, setComments] = useState([]);

    const authModal = useContext(AuthModalContext);


    const fetchCommentsByParentId = async () => {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}comment/all/${postId}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
    }

    useEffect(() => {
        fetchCommentsByParentId();
    }, []);

    const handleAddComment = () => {
        authModal.setShow('login');
    }


    return (
        <div className="block">
            <hr className="border-reddit_border my-4" />
            {
                userInfo.username ?
                    (<>
                        <CommentForm rootId={postId}
                            parentId={null}                   
                            showAuthor={true}
                            onSubmit={() => fetchCommentsByParentId()}
                            disabled={props.disabled}
                        /></>
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
            <RootCommentContext.Provider value={{
                refreshComments: fetchCommentsByParentId,
            }} >
                <Comments parentId={null} comments={comments} rootId={postId} disabled={props.disabled}/>
            </RootCommentContext.Provider>
        </div>
    )
}

export default CommentsPage;