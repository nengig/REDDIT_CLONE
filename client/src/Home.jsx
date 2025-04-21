
import PostList from './PostList.jsx';
export default function Home() {
  return (
    <div className="px-6 bg-reddit_dark text-reddit_text min-h-dvh mt-5 lg:w-[88%] flex flex-col relative lg:left-30">
      <PostList />
    </div >
  );
}
