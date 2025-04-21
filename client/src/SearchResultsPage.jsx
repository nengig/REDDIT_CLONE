
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RedditCommunityCard from "./CommunitySearchCard";
import UserSearchCard from "./UserSearchCard";
import CommentsSearchCard from "./CommentsSearchCard";
import PostDetails from "./PostDetails";


const TABS = ["Posts", "Comments", "Communities", "People"];

export default function SearchPage() {

    const { text } = useParams();
    const [posts, setPosts] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Posts");

    const searchPosts = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}posts/searchPosts?search=${text}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const searchCommunities = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}community/searchCommunities?search=${text}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await res.json();
            setCommunities(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const searchUsers = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}user/searchUsers?search=${text}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    const searchComments = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}comment/searchComments?search=${text}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await res.json();
            console.log(data);
            setComments(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }

    useEffect(() => {
        searchPosts();
        searchCommunities();
        searchUsers();
        searchComments();
    }, [text]);

    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-[#030303] text-white px-4 md:px-10 py-6">
            {/* Search Input */}
            {/* <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center bg-[#1A1A1B] rounded-full px-4 py-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search Reddit"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-white w-full"
          />
        </div>
      </form> */}

            {/* Tabs */}
            <div className="max-w-5xl mx-auto flex border-b border-gray-700 space-x-6 text-sm font-light">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 mb-4 ${activeTab === tab
                            ? "bg-reddit_dark-brightest text-white rounded-full font-light"
                            : "text-gray-400 hover:text-white cursor-pointer"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="max-w-5xl mx-auto space-y-4">
                {activeTab === "Posts" && (
                    posts.length > 0 ? (
                        <div className="mt-4">
                            {posts.map((data, i) => (
                                <PostDetails key={data._id} post={data} from="search" /> // Render each individual post
                                // <Post key={i} {...data} isListing={true} />
                            ))}
                        </div>
                    ) :
                        <div className="bg-[#1A1A1B] p-4 rounded-lg border border-gray-700 mt-5">
                            <p className="text-gray-400 italic">
                                No posts found.
                            </p>
                        </div>
                )}
                {activeTab === "Comments" && (
                    comments.length > 0 ? (
                        comments.map((data, i) => (
                            // <></>
                            <CommentsSearchCard

                                uKey={data._id}
                                comment={{
                                    subreddit: data.postId.communityId.name,
                                    created: data.createdAt,
                                    postTitle: data.postId.title,
                                    user: data.postId.userId.username,
                                    content: data.content,
                                    // votes: "20K",
                                    // totalVotes: "14K",
                                    // totalComments: "9K",
                                    postId: data.postId._id,
                                }}
                            />
                        ))
                    ) :
                        <div className="bg-[#1A1A1B] p-4 rounded-lg border border-gray-700  mt-5">
                            <p className="text-gray-400 italic">No comments found.</p>
                        </div>
                )}
                {activeTab === "Communities" && (
                    communities.length > 0 ? (
                        communities.map((data, i) => (
                            <RedditCommunityCard
                                name={data.name}
                                members={data.members.length}
                                description={data.desc}
                            />
                        ))
                    ) :
                        <div className="bg-[#1A1A1B] p-4 rounded-lg border border-gray-700  mt-5">
                            <p className="text-gray-400 italic">No communities found.</p>
                        </div>
                )}
                {activeTab === "People" && (
                    users.length > 0 ? (
                        users.map((data, i) => (
                            <UserSearchCard
                                name={data.username}
                            />
                        ))
                    ) :
                        <div className="bg-[#1A1A1B] p-4 rounded-lg border border-gray-700  mt-5">
                            <p className="text-gray-400 italic">No users found.</p>
                        </div>
                )}
            </div>
        </div>
    );
}
