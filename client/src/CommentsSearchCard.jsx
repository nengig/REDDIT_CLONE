// import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
// import { Link } from "react-router-dom";

// const mockComments = [
//   {
//     id: 1,
//     user: "johndoe",
//     subreddit: "javascript",
//     postTitle: "What's the difference between var, let and const?",
//     content: "Great question! The main difference lies in scope and mutability...",
//     created: "3 hours ago",
//     postId: "123",
//   },
//   {
//     id: 2,
//     user: "codewizard",
//     subreddit: "reactjs",
//     postTitle: "Why use useEffect?",
//     content: "useEffect is React's way to handle side effects in components...",
//     created: "1 day ago",
//     postId: "456",
//   },
// ];

// export default function CommentsSearchCard() {
//   return (
//     <div className="bg-[#030303] text-white px-6 max-w-4xl mx-auto">
//       {mockComments.map((comment) => (
//         <div
//           key={comment.id}
//           className="p-4 border-b border-gray-700 hover:bg-[#1a1a1b] transition"
//         >
//           <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
//             <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-gray-500" />
//             <span>
//               <Link to={`/user/${comment.user}`} className="hover:underline">
//                 u/{comment.user}
//               </Link>{" "}
//               commented on{" "}
//               <Link to={`/post/${comment.postId}`} className="text-blue-400 hover:underline">
//                 {comment.postTitle}
//               </Link>{" "}
//               in{" "}
//               <Link to={`/r/${comment.subreddit}`} className="text-blue-400 hover:underline">
//                 r/{comment.subreddit}
//               </Link>
//             </span>
//             <span className="ml-auto text-xs">{comment.created}</span>
//           </div>

//           <div className="pl-7 text-sm text-gray-300">
//             {comment.content.length > 200
//               ? comment.content.slice(0, 200) + "..."
//               : comment.content}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }






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
            <span className="font-medium text-white">u/{comment.user}</span> · {" "}
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
