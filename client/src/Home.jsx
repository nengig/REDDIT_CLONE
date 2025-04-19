// Home.jsx
import CommentsPage from './CommentsPage.jsx';
import PostForm from './BoardPostForm.jsx';
import BoardHeader from './BoardHeader.jsx';
export default function Home() {
  return (
    <div className="px-6 bg-reddit_dark text-reddit_text">
        <BoardHeader />
        <PostForm />
      <div className="border border-reddit_border bg-reddit_dark-brighter p-2 rounded-md">
        <h5 className="text-reddit_text-darker text-sm mb-1">
          Posted by u/test123 5 hours ago
        </h5>
        <h2 className="text-xl mb-3">Sample Title with some Lorem Ipsum</h2>
        <div className="text-sm leading-6">
          <p>
            {/* … your long lorem ipsum … */}
          </p>
          <CommentsPage />
        </div>
      </div>
    </div>
  );
}
