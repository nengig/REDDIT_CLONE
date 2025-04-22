import { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import AuthModalContext from "./AuthModalContext";

function Voting(props) {
    const userInfo = useContext(UserContext);
    const authModal = useContext(AuthModalContext);

    const [voted, setVoted] = useState(false);

    const { parentId } = props;

    const [totalVotes, setTotalVotes] = useState(0);
    const [userVote, setUserVote] = useState(null);
    
    const [loadingUserVote, setLoadingUserVote] = useState(true);


    const updateVote = async (direction) => {
        // console.log(direction);

        const vote = {
            parentId: parentId,
            onModel: props.for,
            direction: direction == "up" ? 1 : -1
        }

        const response = await fetch(`http://localhost:8000/comment/vote/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(vote)
        });


        if (!response.ok) {
            // If the response is not OK (e.g., 400 or 500), throw an error
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to vote on comment");
        }

        const data = await response.json();

        // console.log(data);
        setVoted(data.active);
        setUserVote(data?.vote?.direction);

        if (response.ok) {
            getTotalVotes();
            getVotesByUser();
        }
    }

    const getTotalVotes = async () => {
        return fetch(`${import.meta.env.VITE_SERVER_URL}comment/${parentId}/totalvotes/`, { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                // console.log("Total votes data:", data);
                setTotalVotes(data.total_votes);
            })
            .catch((err) => {
                console.error("Error getting total votes:", err.message);
            });
    };
    
    const getVotesByUser = () => {
        fetch(`${import.meta.env.VITE_SERVER_URL}comment/${parentId}/getVoteOfUser`, { credentials: 'include' })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                // console.log("User vote data:", data);
                setUserVote(data.userVote); // adjust this if the format is different
            })
            .catch((err) => {
                console.error("Error getting user vote:", err.message);
            })
            .finally(() => {
                setLoadingUserVote(false);
            });
    };
    
    
    

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                await Promise.all([getTotalVotes(), getVotesByUser()]);
            } catch (err) {
                console.error("Error fetching votes:", err);
            } finally {
                setLoadingUserVote(false);
            }
        };
    
        fetchVotes();
    }, [parentId]);
    


    const handleVoteUp = () => {
        // console.log(userInfo)
        if (userInfo.username == undefined) {
            authModal.setShow('login');
        } else {
            arrowButton('up');
            updateVote("up");
        }
    }

    const hanldeVoteDown = () => {
        if (userInfo.username == undefined) {
            authModal.setShow('login');
        } else {
            arrowButton('down');
            updateVote("down");
        }
    }

    const arrowButton = (directionName = 'up') => {
        const directionNumber = directionName == 'up' ? 1 : -1;
        let classNames = "inline-block h-5 relative top-1 cursor-pointer disabled:cursor-not-allowed"; //  top-1
        let fillColor = "";

        if (userVote !== null && directionNumber == userVote) {
            classNames += `${directionNumber == 1 ? " text-reddit_red " : "#6a5dff"}`;
            fillColor = directionNumber == 1 ? " #d93900 " : "#6a5dff";
        }
        else {
            classNames += " text-reddit_text-darker ";
        }

        if (directionName == 'up') {
            return (
                <button onClick={() => handleVoteUp()} className={!props.disabled && `${classNames}  disabled:cursor-not-allowed`} disabled={props.disabled || props.postDeleted}
                    title={props.disabled ? "You can't upvote a deleted post/comment" : "Upvote"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className="mt-1"
                        viewBox="0 0 24 24"
                        fill={!props.disabled && fillColor} //#6a5dff
                        stroke={props.disabled ? "#5c5a5a" : fillColor ? fillColor : "currentColor"}
                        stroke-width="1"
                        width="28"
                        height="28">
                        <path d="M12 2l7 7h-4v9h-6v-9H5l7-7z" />
                    </svg>
                </button>
            )
        }
        else {
            return (
                <button onClick={() => hanldeVoteDown()} className={!props.disabled && `${classNames}  disabled:cursor-not-allowed`} disabled={props.disabled || props.postDeleted}
                    title={props.disabled ? "You can't downvote a deleted post/comment" : "Downvote"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className="mb-1"
                        viewBox="0 0 24 24"
                        fill={!props.disabled && fillColor}
                        stroke={props.disabled ? "#5c5a5a" : fillColor ? fillColor : "currentColor"}
                        stroke-width="1"
                        width="28"
                        height="28">
                        <path d="M12 22l-7-7h4V6h6v9h4l-7 7z" />
                    </svg>

                </button>
            )
        }

    }

    return (
        <>
            {loadingUserVote ? (
                <div className="text-gray-400 text-sm">Loading votes...</div>
            ) : (
                <div className='inline-block mr-2'>
                    {arrowButton('up')}
                    <div className="inline-block pt-1 w-4 align-middle text-center">
                        {!props.disabled && totalVotes}
                    </div>
                    {arrowButton('down')}
                </div>
            )}
        </>
    );    
    
}

export default Voting;