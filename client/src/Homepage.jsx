// Home.jsx
import CommentsPage from './CommentsPage.jsx';
import PostForm from './BoardPostForm.jsx';
import BoardHeader from './BoardHeader.jsx';
import PostList from './PostList.jsx';
import AuthModal from './AuthModal.jsx';
import { useEffect, useState } from 'react';
import PostDetails from './PostDetails.jsx';


export default function Homepage() {
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        // /home
        const fetchHomepagePosts = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_SERVER_URL}posts/posts/home`, {
                    credentials: "include"
                }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch search results");
                }

                const data = await res.json();
                setPosts(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchHomepagePosts();
    }, []);

    return (
        <div className="px-6 bg-reddit_dark text-reddit_text min-h-dvh mt-5 lg:w-3/5 flex flex-col relative lg:left-30">
            {posts?.length > 0 ? (
                <div className='pl-4'>
                    {
                        posts.map((post) => (
                            <PostDetails key={post._id} post={post} from="home" />
                        ))
                    }
                </div>

            ) : (
                <div className='flex justify-center items-center h-full w-full'>
                    <p>No posts available.</p>
                </div>
            )}
        </div >
    );
}
