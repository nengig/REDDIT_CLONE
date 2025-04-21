// Home.jsx
import CommentsPage from './CommentsPage.jsx';
import PostForm from './BoardPostForm.jsx';
import BoardHeader from './BoardHeader.jsx';
import PostList from './PostList.jsx';
import AuthModal from './AuthModal.jsx';
import { useEffect, useState } from 'react';
import PostDetails from './PostDetails.jsx';
import RedditCommunityCard from './CommunitySearchCard.jsx';


export default function MyCommunitiesPage() {
    const [myCommunities, setMyCommunities] = useState([]);


    useEffect(() => {
        // /home
        const fetchCommunityJoinedByUser = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}community/my-communities`, {
                    credentials: "include"
                }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch search results");
                }

                const data = await res.json();
                console.log("homepage data");
                console.log(data);
                setMyCommunities(data);
            } catch (err) {
                console.error(err);
                // setError(err.message);
            }
        }
        fetchCommunityJoinedByUser();
    }, []);

    return (
        <div className="px-6 bg-reddit_dark text-reddit_text min-h-dvh mt-5  lg:w-[70%] mx-auto">
            <div>
                {myCommunities.length > 0 ? (myCommunities.map((community) => (
                    // <PostDetails key={post._id} post={post} from="home" /> // Render each individual post
                    <RedditCommunityCard
                        name={community.name}
                        members={community.members.length}
                        description={community.desc}
                    />
                ))) :

                    <div className="bg-[#1A1A1B] p-4 rounded-lg border border-gray-700  mt-5">
                        <p className="text-gray-400 italic">You haven't joined any communities yet.</p>
                    </div>
                }
            </div>
        </div >
    );
}
