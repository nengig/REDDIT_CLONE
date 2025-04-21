import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserContext from "./UserContext";
import { PlusIcon } from '@heroicons/react/24/outline';
import PostDetails from "./PostDetails";
import AuthModal from "./AuthModal";

export default function ViewCommunity() {
    const { name } = useParams();
    const [community, setCommunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isMember, setIsMember] = useState(false);
    const [posts, setPosts] = useState([]);

    const user = useContext(UserContext);
    //   const authModal = useContext(AuthModalContext)

    // /community/:communityId/posts

    const getAllPostsInACommunity = async (communityId) => {
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}community/community/${communityId}/posts`);

            if (!response.ok) {
                throw new Error('Community not found.');
            }

            const data = await response.json();
            console.log(user.username);
            console.log("data");
            setPosts(data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Posts not found for a community.');
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        const fetchCommunity = async () => {
            setLoading(true);

            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}community/${name}`);

                if (!response.ok) {
                    throw new Error('Community not found.');
                }

                const data = await response.json();
                console.log(user.username);
                setCommunity(data);
                setIsMember(data?.members?.some(member => member.id == user._id));
                console.log("data");
                getAllPostsInACommunity(data._id);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Community not found.');
            } finally {
                setLoading(false);
            }
        }
        fetchCommunity();
    }, [name, user]);

    if (loading) return <div className="text-gray-800 p-6 text-center text-lg">Loading community...</div>;
    if (error) return <div className="text-red-600 p-6 text-center text-lg">{error}</div>;


    const handleToggleMembership = async () => {
        try {
            if (isMember) {
                console.log("In delete");
                await fetch(`${import.meta.env.VITE_SERVER_URL}community/${name}/leave`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });
                setIsMember(false);
                setCommunity((prev) => ({
                    ...prev,
                    members: prev.members.filter((id) => id !== user._id),
                }));
            } else {
                await fetch(`${import.meta.env.VITE_SERVER_URL}community/${name}/join`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include"
                });
                setIsMember(true);
                setCommunity((prev) => ({
                    ...prev,
                    members: [...prev.members, user._id],
                }));
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    }

    return (
        <div className="min-h-screen py-2 px-5 bg-reddit_dark  text-reddit_text">
            {/* Masthead Banner */}
            <div className="relative w-full bg-reddit_dark-brightest h-22 md:h-40 lg:h-52 bg-cover bg-center rounded-xl"></div>

            {/* Community Header */}
            <section className="relative flex justify-between px-2 md:px-5 -mt-10 mb-6">
                <div className="flex items-end gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-600 border-4 border-white flex items-center justify-center shadow text-white text-3xl font-bold">
                        r/
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">r/{community.name}</h1>
                        <p className="text-sm text-gray-600">
                            {community.members.length.toLocaleString()} member{community.members.length !== 1 && "s"}
                        </p>
                    </div>
                </div>

                {user.username &&
                    <div className="flex items-end gap-4 mt-4 md:mt-0">
                        <button className="border border-white border-1 px-4 py-2 rounded-full hover:border-white-100 transition cursor-pointer" onClick={handleToggleMembership}>
                            {isMember ? "Joined" : "Join"}
                        </button>
                        <Link
                            to={{
                                pathname: `/create-post/`,
                            }}
                            state={{ commName: "r/" + community.name }}
                            className="flex px-3 py-2 rounded-full transition border border-white border-1">
                            <PlusIcon className="text-white-400 w-6 h-6" />
                            Create Post
                        </Link>

                    </div>
                }
            </section>


            <div className="flex mx-3 space-x-6">
                {/* Posts Section (larger space) */}

                {posts?.length > 0 ?
                    (
                        <div className="w-2/3 p-6 ">
                            {posts.map((data, i) => (
                                <PostDetails key={data._id} post={data} from="community" /> // Render each individual post
                                // <Post key={i} {...data} isListing={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="border border-gray-700 rounded-lg p-6 mt-10 w-2/3">
                            <h2 className="text-xl font-semibold mb-3">Posts</h2>
                            <div className="text-gray-500 italic">No posts yet.</div>
                        </div>
                    )}

                {/* About Community Section (on the right) */}
                <div className="border border-gray-700 rounded-lg mt-10 p-6 w-1/3 max-h-min">
                    <h2 className="text-xl font-semibold mb-3">About Community</h2>
                    <p className="text-gray-400 mb-2">{community.desc}</p>
                    <p className="text-sm text-gray-600">
                        {community.members.length.toLocaleString()} member{community.members.length !== 1 && "s"}
                    </p>
                    <p className="text-sm text-gray-500">
                        Created on {new Date(community.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div >


        </div >
    );
}
