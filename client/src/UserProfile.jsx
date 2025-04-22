



import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PlusIcon, MinusCircleIcon, MinusIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftRightIcon, DocumentTextIcon, UserIcon } from "@heroicons/react/24/outline";
import TimeAgo from 'timeago-react';
import Avatar from './avatar.png';
import UserContext from "./UserContext";
import axios from 'axios';
import PostDetails from "./PostDetails";

import ConfirmModal from "./ConfirmModal";


const TABS = ["Overview", "Posts", "Comments", "Upvoted", "Downvoted"];

export default function ViewUserProfile() {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState("Overview");
    const [userData, setUserData] = useState([]);
    const [following, setFollowing] = useState(false); //logged In user
    const [numOfFollowers, setNumOfFollowers] = useState();
    const [numOfFollowing, setNumOfFollowing] = useState();

    const [upvotes, setUpvotes] = useState([]);
    const [downvotes, setDownvotes] = useState([]);

    const loggedInUserInfo = useContext(UserContext);

    const [error, setError] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [form, setForm] = useState({ username: '', email: '' });
    const [passForm, setPassForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);


    useEffect(() => {
        // console.log("username ", loggedInUserInfo.username);


        const getUserProfile = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}user/u/${loggedInUserInfo.username}`
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch search results");
                }

                const data = await res.json();
                // console.log(data);
                setUserData(data);
                isFollowing(data._id);
                getNumOfFollowers(data._id);
                getNumOfFollowing(data._id);
            } catch (err) {
                console.error(err);
            }
        }

        getUserProfile();
        getUpvotes();
        getDownvotes();
        if (loggedInUserInfo.username) {
            setForm({ username: loggedInUserInfo.username, email: loggedInUserInfo.email });
        }

    }, [loggedInUserInfo.username, loggedInUserInfo.email]);


    const getUpvotes = async () => {
        // posts/upvoted
        try {
            // console.log(`${import.meta.env.VITE_SERVER_URL}posts/posts/upvoted`);
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}posts/posts/upvoted`, {
                credentials: "include"
            }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await res.json();
            console.log(data);
            setUpvotes(data);
        } catch (err) {
            console.error(err);
        }
    }
    
    const getDownvotes = async () => {
        // posts/upvoted
        try {
            // console.log(`${import.meta.env.VITE_SERVER_URL}posts/posts/upvoted`);
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}posts/posts/downvoted`, {
                credentials: "include"
            }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await res.json();
            console.log(data);
            setDownvotes(data);
        } catch (err) {
            console.error(err);
        }
    }


    // followingId
    const isFollowing = async (targetUserId) => {
        try {
            // console.log(targetUserId);
            // console.log(`${import.meta.env.VITE_SERVER_URL}follow/isFollowing/${targetUserId}`);
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}follow/isFollowing/${targetUserId}`, {
                credentials: "include"
            }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await res.json();
            // console.log(data);
            setFollowing(data.isFollowing);
        } catch (err) {
            console.error(err);
        }
    }

    // getNumOfFollowers
    const getNumOfFollowers = async (targetUserId) => {
        try {
            // console.log(targetUserId);
            // console.log(`${import.meta.env.VITE_SERVER_URL}follow/${targetUserId}/followers/`);
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}follow/${targetUserId}/followers/`);

            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await res.json();
            // console.log(data.length);
            setNumOfFollowers(data.length);
        } catch (err) {
            console.error(err);
        }
    }

    // getNumOfFollowers
    const getNumOfFollowing = async (targetUserId) => {
        try {
            // console.log(targetUserId);
            // console.log(`${import.meta.env.VITE_SERVER_URL}follow/${targetUserId}/following/`);
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}follow/${targetUserId}/following/`);

            if (!res.ok) {
                throw new Error("Failed to fetch search results");
            }

            const data = await res.json();
            // console.log(data);
            setNumOfFollowing(data.length);
        } catch (err) {
            console.error(err);
        }
    }


    const handleChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        axios
            .put(
                `${import.meta.env.VITE_SERVER_URL}user/updateUser`,
                form,
                { withCredentials: true }
            )
            .then(({ data: updated }) => {
                loggedInUserInfo.setUser(updated);
                setForm({ username: updated.username, email: updated.email });
                setIsEditing(false);
            })
            .catch(err => {
                setError(err.response?.data?.message || 'update failed');
            });
    };

    const handlePassChange = (e) =>
        setPassForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (passForm.newPassword !== passForm.confirmPassword) {
            setError("new passwords don't match");
            return;
        }
        axios.put(
            `${import.meta.env.VITE_SERVER_URL}user/changePassword`,
            {
                currentPassword: passForm.currentPassword,
                newPassword: passForm.newPassword,
            },
            { withCredentials: true }
        )
            .then(() => {
                setIsChangingPassword(false);
                setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            })
            .catch(err => {
                setError(err.response?.data?.message || 'password change failed');
            });
    };

    const handleDelete = () => {
        setDeleteTarget({ type: 'profile' });
        setModalOpen(true);
    };


    const onConfirmDelete = () => {
        if (deleteTarget?.type === 'profile') {
            axios
                .delete(`${import.meta.env.VITE_SERVER_URL}user/delete`, { withCredentials: true })
                .then(() => {
                    loggedInUserInfo.logout();
                    navigate('/');
                })
                .catch(err => {
                    setError(err.response?.data?.error || 'Account deletion failed');
                })
                .finally(() => {
                    setModalOpen(false);
                    setDeleteTarget(null);
                });
        }
    }


    return (
        <div className="bg-[#030303] min-h-screen text-white ">
            {userData?.username ? (
                <div>
                    <div className="relative h-40 bg-[#1A1A1B] mx-3 rounded-lg">
                        <div className="absolute -bottom-10 left-6">
                            <div className="w-24 h-24 rounded-full border-4 border-[#030303] bg-gray-800 flex items-center justify-center">

                                <img
                                    src={Avatar}
                                    alt=""
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    {userData && (
                        <div className="mt-12 ml-5">
                            <h1 className="text-2xl font-bold mb-2  ml-6">u/{userData.username}</h1>

                            {!isEditing && !isChangingPassword && (
                                <div className="lg:flex mx-3 space-x-6">

                                    <div className="p-6 w-2/3">
                                        {/* Tabs */}
                                        <div className="border-b border-gray-700 mb-4 flex space-x-6 text-sm font-semibold">
                                            {TABS.map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`py-2 px-4 mb-4 text-md ${activeTab === tab
                                                        ? "bg-reddit_dark-brightest text-white rounded-full font-light"
                                                        : "text-gray-400 hover:text-white cursor-pointer"
                                                        }`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>



                                        {activeTab === "Overview" && (
                                            <div className="space-y-4 ml-4">
                                                {userData.posts.length === 0 && userData.comments.length == 0 ? (
                                                    <p className="text-gray-400 italic">No posts or comments yet.</p>
                                                ) : (
                                                    userData.posts.concat(userData.comments).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => {
                                                        if (!post.communityId) {
                                                            return (
                                                                <div className=" mt-1 mb-4">
                                                                    <Link to={`/post/${post.postId?._id}`} >
                                                                        <div key={post._id} className="bg-[#1A1A1B] rounded-lg p-4">
                                                                            <div className="flex">
                                                                                <div className="overflow-hidden bg-reddit_text w-7 h-7 rounded-full mr-2 self-center">
                                                                                    <img src={Avatar} alt="" className="block w-full h-full object-cover" />
                                                                                </div>
                                                                                <h2 className="text-md font-light self-center">u/{userData.username}</h2>

                                                                            </div>
                                                                            <p className="text-gray-400 text-xs my-2 flex">commented on <p className="text-white ml-2">

                                                                                {post.postId?.title?.slice(0, 50)}{post.postId?.title?.length > 50 && '...'}
                                                                            </p>
                                                                                <span className="ml-2"> {' '}•</span>
                                                                                <TimeAgo className="ml-2" datetime={post.createdAt} /> </p>
                                                                            <h2 className="text-sm font-light">
                                                                                {post.content}
                                                                            </h2>

                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            )
                                                        }
                                                        else {
                                                            return (
                                                                <PostDetails key={post._id} post={post} from="userProfile" />
                                                            )
                                                        }
                                                    })
                                                )}
                                            </div>
                                        )}

                                        {/* Posts Tab content */}
                                        {activeTab === "Posts" && (
                                            <div className="space-y-4 ml-4">
                                                {userData.posts.length === 0 ? (
                                                    <p className="text-gray-400 italic">No posts yet.</p>
                                                ) : (
                                                    userData.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => (

                                                        <PostDetails key={post._id} post={post} from="userProfile" />

                                                    ))
                                                )}
                                            </div>
                                        )}

                                        {activeTab === "Comments" && (

                                            <div className="space-y-4  ml-4">
                                                {userData.comments.length === 0 ? (
                                                    <div className="text-gray-400 italic">No comments yet.</div>
                                                ) : (
                                                    userData.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment) => (

                                                        <div className=" mt-1 mb-4">
                                                            <Link to={`/post/${comment.postId?._id}`} >
                                                                <div key={comment._id} className="bg-[#1A1A1B] rounded-lg p-4  max-w-full">
                                                                    <div className="flex">
                                                                        <div className="overflow-hidden bg-reddit_text w-7 h-7 rounded-full mr-2 self-center">
                                                                            <img src={Avatar} alt="" className="block w-full h-full object-cover" />
                                                                        </div>
                                                                        <h2 className="text-md font-light self-center">u/{userData.username}</h2>
                                                                        {/* //font-sans */}
                                                                    </div>
                                                                    {/* <p className="text-gray-400 text-xs mb-1">{comment.createdAt}</p> */}
                                                                    <p className="text-gray-400 text-xs my-2 flex">commented on <p className="text-white ml-2">
                                                                        {comment.postId?.title?.slice(0, 50)}{comment.postId?.title?.length > 50 && '...'}
                                                                        {/* {comment.postId?.title} */}
                                                                    </p>
                                                                        <span className="ml-2"> {' '}•</span>
                                                                        <TimeAgo className="ml-2" datetime={comment.createdAt} /> </p>
                                                                    <h2 className="text-sm font-light">{comment.content}</h2>

                                                                </div>
                                                            </Link>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}


                                        {/* Upvoted Tab content */}
                                        {activeTab === "Upvoted" && (
                                            <div className="space-y-4 ml-4">
                                                {upvotes.posts.length === 0 ? (
                                                    <p className="text-gray-400 italic">No upvoted posts yet.</p>
                                                ) : (
                                                    upvotes.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => (

                                                        <PostDetails key={post._id} post={post} from="userProfile" />

                                                    ))
                                                )}
                                            </div>
                                        )}


                                        {/* Upvoted Tab content */}
                                        {activeTab === "Downvoted" && (
                                            <div className="space-y-4 ml-4">
                                                {downvotes.posts.length === 0 ? (
                                                    <p className="text-gray-400 italic">No downvoted posts yet.</p>
                                                ) : (
                                                    downvotes.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => (

                                                        <PostDetails key={post._id} post={post} from="userProfile" />

                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>


                                    <div className="border border-gray-700 rounded-lg p-6 w-1/3 mt-12 max-h-min">
                                        <h1 className="text-2xl font-bold mb-4 ml-1">u/{userData.username}</h1>


                                        <div className="flex gap-4 text-sm text-gray-400 my-4">
                                            <span>{numOfFollowers} follower{numOfFollowers?.length > 1 && "s"}</span>
                                        </div>

                                        <div className="flex gap-4 text-sm text-gray-400 my-4">
                                            <span>{numOfFollowing} following</span>
                                        </div>


                                        <div className="flex gap-4 text-sm text-gray-400 my-4">
                                            <span>Created on •{' '}  {new Date(userData.createdAt).toLocaleDateString('en-CA', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                            </span>
                                        </div>


                                        <div className="lg:w-[50%] mx-auto">
                                            <button
                                                onClick={() => {
                                                    setIsChangingPassword(false);
                                                    setIsEditing(v => !v);
                                                    setError('');
                                                }}
                                                className="w-full px-4 py-2  bg-[#d93900] text-reddit_text rounded hover:opacity-75 transition cursor-pointer"
                                            >
                                                {isEditing ? 'Cancel' : 'Edit Profile'}
                                            </button>

                                            <div className='py-2 mt-2'>
                                                < button
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setIsChangingPassword(v => !v);
                                                        setError('');
                                                    }}
                                                    className="w-full px-4 py-2  bg-[#d93900]    text-reddit_text  rounded hover:opacity-75 transition cursor-pointer"
                                                >
                                                    Change Password
                                                </button>
                                            </div>


                                            <div className='py-2'>
                                                <button
                                                    onClick={handleDelete}
                                                    className="w-full px-4 py-2 bg-red-600  text-white rounded hover:opacity-75 transition cursor-pointer"
                                                >
                                                    Delete Account
                                                </button>
                                                <ConfirmModal
                                                    isOpen={modalOpen}
                                                    onClose={() => setModalOpen(false)}
                                                    onConfirm={onConfirmDelete}
                                                    message={`Are you sure you want to delete your ${deleteTarget?.type}? This cannot be undone.`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {isEditing && (
                                <form onSubmit={handleSubmit} className="p-6 border-t border-reddit-border space-y-4 lg:w-[75%] lg:mx-auto">
                                    <h2 className="text-2xl text-center text-gray-400">Edit Profile</h2>

                                    {error && <p className="text-red-500">{error}</p>}
                                    <div>
                                        <label className="block text-sm text-gray-400">Username</label>
                                        <input
                                            name="username"
                                            value={form.username}
                                            onChange={handleChange}
                                            className="w-full mt-1 p-2 bg-reddit-dark-brightest rounded border border-reddit-border"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400">Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="w-full mt-1 p-2 bg-reddit-dark-brightest rounded border border-reddit-border"
                                        />
                                    </div>
                                    <div className='flex '>
                                        <button
                                            type="submit"
                                            className=" px-4 py-2 bg-[#f54405] mr-2  text-reddit_text rounded hover:opacity-75 transition w-1/2 "
                                        >
                                            Save Changes
                                        </button>

                                        <button
                                            onClick={() => {
                                                setIsChangingPassword(false);
                                                setIsEditing(v => !v);
                                                setError('');
                                            }}
                                            className="px-4 py-2 bg-[#f54405]  ml-2  text-reddit_text rounded hover:opacity-75 transition w-1/2 "
                                        >
                                            Cancel
                                            {/* {isEditing ? 'Cancel' : 'Edit Profile'} */}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {isChangingPassword && (
                                <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-4 lg:w-[75%] lg:mx-auto">
                                    <h2 className="text-2xl text-center text-gray-400">Edit Profile</h2>
                                    {error && <p className="text-red-500">{error}</p>}
                                    <div>
                                        <label className="block text-sm text-gray-400">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passForm.currentPassword}
                                            onChange={handlePassChange}
                                            className="w-full mt-1 p-2 bg-reddit-dark-brightest rounded border border-reddit-border"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passForm.newPassword}
                                            onChange={handlePassChange}
                                            className="w-full mt-1 p-2 bg-reddit-dark-brightest rounded border border-reddit-border"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passForm.confirmPassword}
                                            onChange={handlePassChange}
                                            className="w-full mt-1 p-2 bg-reddit-dark-brightest rounded border border-reddit-border"
                                        />
                                    </div>
                                    <div className='flex '>
                                        <button
                                            type="button"
                                            onClick={() => { setIsChangingPassword(!isChangingPassword) }}
                                            className="w-1/2 px-4 py-2 mr-2 bg-red-700 text-reddit_text rounded hover:opacity-75 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-1/2 px-4 py-2 ml-2 bg-reddit_orange text-reddit_text rounded hover:opacity-75 transition"
                                        >
                                            Update Password
                                        </button>

                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flext mx-auto items-center justify-center">
                    <p>User doesn't exist.</p>
                </div>
            )}
        </div>
    );
}