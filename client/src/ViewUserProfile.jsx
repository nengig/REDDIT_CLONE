import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PlusIcon, MinusCircleIcon, MinusIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftRightIcon, DocumentTextIcon, UserIcon } from "@heroicons/react/24/outline";
import TimeAgo from 'timeago-react';
import Avatar from './avatar.png';
import UserContext from "./UserContext";
import PostDetails from "./PostDetails";

const TABS = ["Overview", "Posts", "Comments"];

export default function ViewUserProfile() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const [userData, setUserData] = useState();
  const [following, setFollowing] = useState(false); //logged In user
  const [numOfFollowers, setNumOfFollowers] = useState();
  const [numOfFollowing, setNumOfFollowing] = useState();

  const loggedInUserInfo = useContext(UserContext);


  ///u/:username


  useEffect(() => {
    console.log("username ", username);


    const getUserProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}user/u/${username}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();
        console.log(data);
        setUserData(data);
        isFollowing(data._id);
        getNumOfFollowers(data._id);
        getNumOfFollowing(data._id);
      } catch (err) {
        console.error(err);
      }
    }

    getUserProfile()

  }, [username]);


  // followingId
  const isFollowing = async (targetUserId) => {
    try {
      console.log(targetUserId);
      console.log(`${import.meta.env.VITE_SERVER_URL}follow/isFollowing/${targetUserId}`);
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}follow/isFollowing/${targetUserId}`, {
        credentials: "include"
      }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await res.json();
      console.log(data);
      setFollowing(data.isFollowing);
    } catch (err) {
      console.error(err);
    }
  }

  // getNumOfFollowers
  const getNumOfFollowers = async (targetUserId) => {
    try {
      console.log(targetUserId);
      console.log(`${import.meta.env.VITE_SERVER_URL}follow/${targetUserId}/followers/`);
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}follow/${targetUserId}/followers/`);

      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await res.json();
      console.log(data.length);
      setNumOfFollowers(data.length);
    } catch (err) {
      console.error(err);
    }
  }

  // getNumOfFollowers
  const getNumOfFollowing = async (targetUserId) => {
    try {
      console.log(targetUserId);
      console.log(`${import.meta.env.VITE_SERVER_URL}follow/${targetUserId}/following/`);
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}follow/${targetUserId}/following/`);

      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await res.json();
      console.log(data);
      setNumOfFollowing(data.length);
    } catch (err) {
      console.error(err);
    }
  }

  const followUser = async () => {
    try {
      let res;
      if (following) {
        res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}follow/unfollow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({ followingId: userData._id })
        });
      }
      else {
        res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}follow/follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
          body: JSON.stringify({ followingId: userData._id })
        });
      }

      if (!res.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await res.json();
      setFollowing(data.follow != null && true);

      getNumOfFollowers(userData._id);
      getNumOfFollowing(userData._id);
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <div className="bg-[#030303] min-h-screen text-white ">
      <div className="relative h-40 bg-[#1A1A1B] mx-3 rounded-lg">
        <div className="absolute -bottom-10 left-6">
          <div className="w-24 h-24 rounded-full border-4 border-[#030303] bg-gray-800 flex items-center justify-center">
            {/* <UserCircleIcon className="w-20 h-20 text-white" /> */}
            <img
              src={Avatar}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Info */}
      {userData && (
        //  className="mt-16 mx-auto"
        <div className="mt-12 ml-5">
          <h1 className="text-2xl font-bold mb-2  ml-6">u/{userData.username}</h1>
          <div className="flex mx-3 space-x-6">

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
                          // <div key={post.id} className="bg-[#1A1A1B] border border-gray-700 rounded-lg p-4">
                          //   <TimeAgo className="leading-10 pr-2 text-md font-sans" datetime={post.createdAt} />
                          //   <p className="text-gray-400 text-xs mb-1">{post.createdAt}</p>
                          //   <h2 className="text-lg font-semibold">{post.content}</h2>
                          // </div>
                          <div className=" mt-1 mb-4">
                            <Link to={`/post/${post.postId?._id}`} >
                              <div key={post._id} className="bg-[#1A1A1B] rounded-lg p-4">
                                <div className="flex">
                                  <div className="overflow-hidden bg-reddit_text w-7 h-7 rounded-full mr-2 self-center">
                                    <img src={Avatar} alt="" className="block w-full h-full object-cover" />
                                  </div>
                                  <h2 className="text-md font-light self-center">u/{userData.username}</h2>
                                  {/* //font-sans */}
                                </div>
                                {/* <p className="text-gray-400 text-xs mb-1">{comment.createdAt}</p> */}
                                <p className="text-gray-400 text-xs my-2 flex">commented on <p className="text-white ml-2">
                                  {/* {post.postId?.title} */}
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
                          <PostDetails key={post._id} post={post} from="userProfile" /> // Render each individual post
                          // <div key={post.id} className="bg-[#1A1A1B] border border-gray-700 rounded-lg p-4">
                          //   <p className="text-gray-400 text-xs mb-1">r/{post.subreddit} ·
                          //     <TimeAgo className="leading-10 pr-2 text-md font-sans" datetime={post.createdAt} /></p>
                          //   <h2 className="text-lg font-semibold">{post.title}</h2>
                          // </div>
                        )
                      }
                    })
                  )}
                </div>
              )}

              {/* Tab content */}
              {activeTab === "Posts" && (
                <div className="space-y-4 ml-4">
                  {userData.posts.length === 0 ? (
                    <p className="text-gray-400 italic">No posts yet.</p>
                  ) : (
                    userData.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post) => (

                      <PostDetails key={post._id} post={post} from="userProfile" /> // Render each individual post

                      // <div key={post.id} className="bg-[#1A1A1B] border border-gray-700 rounded-lg p-4">
                      //   <p className="text-gray-400 text-xs mb-1">r/{post.subreddit} ·
                      //     <TimeAgo className="leading-10 pr-2 text-md font-sans" datetime={post.createdAt} /></p>
                      //   <h2 className="text-lg font-semibold">{post.title}</h2>
                      // </div>
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
            </div>


            <div className="border border-gray-700 rounded-lg p-6 w-1/3 mt-12 max-h-min">
              <h1 className="text-2xl font-bold mb-4 ml-1">u/{userData.username}</h1>
              {/* <button
                type="submit"
                className="bg-blue-700 text-white px-8 py-2 rounded-full hover:bg-blue-600"
              >
                Create
              </button> */}

              {loggedInUserInfo.username && loggedInUserInfo.username != userData.username && (
                <button class="items-center justify-center button inline-flex rounded-full px-2 py-1 bg-[#105bca] pr-3 cursor-pointer" onClick={followUser}>
                  <span class="flex items-center justify-center">
                    {
                      following ? (
                        <>
                          <MinusCircleIcon className="w-5 h-5 mr-1" />
                          {/* <MinusIcon className="w-5 h-5 mr-1" /> */}
                          <span class="flex items-center gap-xs">
                            Unfollow
                          </span>
                        </>
                      ) : (
                        <>
                          <PlusIcon className="w-5 h-5 mr-1" />
                          <span class="flex items-center gap-xs">
                            Follow
                          </span>
                        </>
                      )
                    }
                  </span>

                </button>
              )}

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
                  {/* {userData.createdAt} */}
                  {/* <TimeAgo
                            className="text-sm font-sans text-gray-500"
                            datetime={userData.createdAt}
                        /> */}
                  {/* {userData.createdAt} */}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
