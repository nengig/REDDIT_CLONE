import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubredditSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-reddit_dark-brighter border border-reddit_border rounded-md p-4 text-white space-y-4">
      <button
        onClick={() => navigate('/create-post')}
        className="w-full bg-reddit_orange text-white py-2 rounded font-semibold hover:bg-orange-600"
      >
        Create Post
      </button>

      <button className="w-full bg-gray-700 py-2 rounded font-medium hover:bg-gray-600">
        🔔 Notifications
      </button>

      <button className="w-full bg-blue-600 py-2 rounded font-medium hover:bg-blue-500">
        Join
      </button>
    </div>
  );
};

export default SubredditSidebar;
