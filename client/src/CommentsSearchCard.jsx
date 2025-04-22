import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import TimeAgo from "timeago-react";

const CommentsSearchCard = ({ comment, uKey }) => {
  return (
    <Link
      to={`/post/${comment.postId}`}
      className="mb-3 px-4 py-1 "
      key={uKey}
    // className="text-blue-500 text-sm font-semibold"
    >
      <div className="bg-[#0b1416] text-white px-4 py-6 border-b border-[#1a1a1b]">
        {/* Subreddit & Timestamp */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
          <img
            src={`https://www.redditstatic.com/avatars/avatar_default_01_0DD3BB.png`}
            className="w-5 h-5 rounded-full"
            alt="subreddit"
          />
          {/* #33a8ff */}
          <Link to={`/r/${comment.subreddit}`} className="font-medium hover:underline text-[#7cc3f8]">
            r/{comment.subreddit}
          </Link>
          <span>·</span>
          <span><TimeAgo
            className="text-sm font-sans text-gray-500"
            datetime={comment.created} //postCreatedAt
          /></span>
        </div>

        {/* Post Title */}
        <h2 className="text-lg font-semibold mb-3">{comment.postTitle}</h2>

        {/* Comment Box */}
        <div className="bg-[#1a1a1b] p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">
            <span className="font-medium text-white">u/{comment.user ? comment.user : "deleted"}</span> · {" "}
            <TimeAgo
              className="text-sm font-sans text-gray-500"
              datetime={comment.created} //postCreatedAt
            />
          </div>
          <p className="text-gray-200 mb-2 text-[15px] leading-relaxed">{comment.content}</p>
          {/* <div className="text-gray-400 text-sm">{comment.votes} votes</div> */}
        </div>

        {/* Go to Thread */}
        <div className="mt-3">

          <Link
            to={`/post/${comment.postId}`}
            className="text-[#7cc3f8] text-sm font-semibold hover:underline"
          >
            Go To Thread
          </Link>
          {/* <span className="text-gray-500 text-sm ml-2">
          {comment.totalVotes} votes · {comment.totalComments} comments
        </span> */}
        </div>
      </div>
    </Link>
  );
};

export default CommentsSearchCard;
