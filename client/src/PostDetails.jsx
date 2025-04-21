

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './avatar.png'
import TimeAgo from 'timeago-react';


const PostDetails = ({ post, from }) => {
  const [communityName, setCommunityName] = useState();



  useEffect(() => {
    const getCommunityInfo = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}community/id/${post.communityId}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await res.json();
        setCommunityName("r/" + data.name);
      } catch (err) {
        console.error(err);
        // setError(err.message);
      }
    }

    getCommunityInfo();
  }, [])

  if (!post) return null;

  return (
    <div className="post-item border-b border-reddit_border bg-reddit_dark-brighter p-4 mt-4 rounded-md hover:bg-reddit_dark-brightest transition ">
      {/* Entire card links to the post page */}
      <div className='flex'>

        <Link to={"/" + communityName} className='flex'>
          {from == "home" || from == "search" || from == "userProfile" ?

            <div className="shrink-0 w-[23px] h-[23px] md:w-7 md:h-7 rounded-full bg-green-600 flex items-center justify-center shadow text-white text-sm font-bold">
              r/
            </div> :
            <div className="overflow-hidden bg-reddit_text w-9 h-9 rounded-full mr-2">
              <img src={Avatar} alt="" className="block w-full h-full object-cover" />
            </div>
          }


          <h3 className="text-sm text-reddit_text ml-2 self-center">
            {communityName}
          </h3>
        </Link>

        <div className='self-center'>

          <p className="text-sm text-reddit_text-darker ml-3">
            {'   '} • {' '}
            <TimeAgo
              className="text-sm font-sans text-gray-500"
              datetime={post.createdAt}
            />
          </p>
        </div>


      </div>
      <Link to={`/post/${post._id}`} className="block mb-2">

        <div>
          <p className="text-sm text-reddit_text break-words">
            {post.title?.slice(0, 100)}{post.title?.length > 100 && '...'}
          </p>
        </div>

        <p className="text-sm text-reddit_text break-words">
          {post.body?.slice(0, 100)}{post.body?.length > 100 && '...'}
        </p>

      </Link >
    </div >
  );
};

export default PostDetails;
