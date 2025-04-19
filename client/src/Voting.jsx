import { useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import AuthModalContext from "./AuthModalContext";

function Voting(props) {
    const userInfo = useContext(UserContext);
    const authModal = useContext(AuthModalContext);

    const { parentId } = props;

    const [totalVotes, setTotalVotes] = useState(0);
    const [userVote, setUserVote] = useState(0);

    const updateVote = async (direction) => {
        console.log(direction);

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

        if (response.ok) {
            getTotalVotes();
            getVotesByUser();
        }
    }

    const getTotalVotes = () => {
        fetch(`http://localhost:8000/comment/${props.parentId}/totalvotes/`).then((res) => res.json()).then((data) => {
            setTotalVotes(data.total_votes);
        }).catch((err) => {
            console.error("Error getting total votes:", err.message);
        });
    }

    const getVotesByUser = () => {
        const userId = "67ef1584ca7a80336f890bd8";
        fetch(`http://localhost:8000/comment/${props.parentId}/getVote`, { credentials: 'include' }).then((res) => res.json()).then((data) => {
            console.log("in get users by vote")
            console.log(data)
            setUserVote(data.userVote);
        }).catch((err) => {
            console.error("Error getting total votes:", err.message);
        });
    }

    useEffect(() => {
        getTotalVotes();
        getVotesByUser();
    }, [parentId]);


    const handleVoteUp = () => {
        console.log(userInfo)
        if (userInfo.username == undefined) {
            authModal.setShow('login');
        } else {
            updateVote("up");
        }
    }

    const hanldeVoteDown = () => {
        if (userInfo.username == undefined) {
            authModal.setShow('login');
        } else {
            updateVote("down");
        }
    }

    const arrowButton = (directionName = 'up') => {
        const directionNumber = directionName == 'up' ? 1 : -1;
        let classNames = "inline-block h-5 relative top-1";


        if (directionNumber == userVote) {
            classNames += ' text-reddit_red  ';
        }
        else {
            classNames += " text-reddit_text-darker  hover:text-white ";
        }

        if (directionName == 'up') {
            return (
                <button onClick={() => handleVoteUp()} className={classNames}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                    </svg>

                </button>
            )
        }
        else {
            return (
                <button onClick={() => hanldeVoteDown()} className={classNames}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>

                </button>
            )
        }

    }

    return (
        <div className='inline-block mr-2 '>
            {arrowButton('up')}
            <div className={"inline-block"}>{totalVotes}</div>
            {arrowButton('down')}
        </div>
    )
}

export default Voting;