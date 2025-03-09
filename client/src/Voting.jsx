import { useContext } from "react";
import RootCommentContext from "./RootCommentContext";

function Voting(props) {

    const rootCommentInfo = useContext(RootCommentContext);

    const {commentsTotals, userVotes} = rootCommentInfo;

    const {commentId} = props;


    const total = commentsTotals && commentId in commentsTotals ? commentsTotals[props.commentId] : 0;
    const userVote = userVotes && commentId in userVotes ? userVotes[props.commentId] : 0 ;

    const updateVote = async (direction) => {
        console.log(direction);
        const response = await fetch(`http://localhost:8000/comment/vote/${props.commentId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vote: direction })
        });

        const data = await response.text();
        console.log(data);
        rootCommentInfo.refreshVotes();
    }


    const handleVoteUp = () => {
        updateVote("up");
    }

    const hanldeVoteDown = () => {
        updateVote("down");
    }

    const arrowButton = (directionName = 'up') => {
        const directionNumber = directionName == 'up' ? 1 : -1;
        let classNames = "inline-block h-5 relative top-1";


        if(directionNumber == userVote){
            classNames += ' text-reddit_red  ';
        }
        else{
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
            <div className={"inline-block"}>{total}</div>
            {arrowButton('down')}
        </div>
    )
}

export default Voting;