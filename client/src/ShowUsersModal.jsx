import { useEffect } from 'react';
import Avatar from './avatar.png';
import { Link } from 'react-router-dom';

export default function ShowUsersModal({ isOpen, onClose, title, users }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white text-black w-[90%] max-w-md dark:bg-[#1a1a1b]  rounded-lg p-6 relative max-h-[66vh] overflow-y-auto">
        

        <h2 className="text-xl text-black font-bold mb-4">{title}</h2>
        <div className="relative">
          <button onClick={onClose} className="absolute -top-11 right-6 text-black-500 hover:text-gray text-lg cursor-pointer">
            Close &times;
          </button>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          users.map((user) => (
            <Link to={`/u/${title === "Followers" ? user.followerId?.username : user.followingId?.username}`}key={user._id}>
              <div className="flex items-center justify-between border-b border-gray-600 px-1 py-4 hover:bg-muted transition">
                <div className="flex items-start space-x-4 w-full">
                  <div className="w-14 h-12 bg-reddit-border rounded-full flex items-center justify-center text-2xl font-bold  text-gray-400 overflow-hidden">
                    <img
                      src={Avatar}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex items-center h-full w-full overflow-hidden mt-2">
                    <p className="text-lg truncate pb-2 text-black"> {(title == "Followers") ? user.followerId?.username : user.followingId?.username}</p>
                  </div>
                </div>
              </div>
            </Link>)
          ))}
      </div>
    </div>
  );
}
