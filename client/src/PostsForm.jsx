import { useCreatePostMutation, useUpdatePostMutation, useGetPostByIdQuery } from './features/api/apiSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';
import UserContext from './UserContext';

const PostsForm = () => {
  const location = useLocation();
  const { commName } = location.state || {};

  const user = useContext(UserContext);
  const [query, setQuery] = useState(commName || '');
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    author: '',
    title: '',
    body: '',
  });

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const { data: postData, isLoading: loadingPost } = useGetPostByIdQuery(id, {
    skip: !isEdit,
  });

  useEffect(() => {
    if (postData) {
      setForm({
        author: postData.author || '',
        title: postData.title || '',
        body: postData.body || '',
      });

      const match = communities.find((c) => c._id == postData.communityId);
      setQuery("r/" + match?.name);
      setSelectedCommunity(match);
    }
  }, [postData, communities]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      ...form,
      author: `u/${user.username}`,
      userId: user._id,
      communityId: selectedCommunity._id,
    };

    if (isEdit) {
      await updatePost({ id, ...postData });
    } else {
      await createPost(postData);
    }
    navigate("/home");
    // navigate(-1);
  };

  const getAllCommunities = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}community/`);
      if (!res.ok) throw new Error('Failed to fetch communities');
      const data = await res.json();
      setCommunities(data);
      setFilteredCommunities(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    getAllCommunities();
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!communities.length) return;
    const filtered = communities.filter((comm) =>
      comm.name.toLowerCase().includes(query?.toLowerCase())
    );
    setFilteredCommunities(filtered);
  }, [query, communities]);

  useEffect(() => {
    const match = communities.find((c) => `r/${c.name}` === query);
    setSelectedCommunity(match || null);
  }, [query, communities]);

  const handleSelect = (comm) => {
    setSelectedCommunity(comm);
    setQuery(`r/${comm.name}`);
    setShowDropdown(false);
  };

  if (isEdit && loadingPost) return <p className="text-white px-6">Loading post data...</p>;

  return (
    <div className="px-6 py-8 flex items-center justify-center min-h-dvh  "> 
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-2xl mx-auto bg-reddit_dark-brightest p-6 rounded-md border border-reddit_border text-white w-full"
      >
        <h2 className="text-2xl font-semibold mb-4">{isEdit ? 'Edit Post' : 'Create Post'}</h2>

        <p className="text-gray-400 mb-1">
          Posting as <span className="font-semibold text-white">u/{user.username}</span>
        </p>

        <div className="relative mb-6 mt-4" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Search community"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring"
            value={query}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => setQuery(e.target.value)}
          />
          {showDropdown && filteredCommunities.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded shadow max-h-60 overflow-auto">
              {filteredCommunities.map((comm) => (
                <li
                  key={comm._id}
                  className="p-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSelect(comm)}
                >
                  r/{comm.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="text"
          name="title"
          placeholder="Post title"
          className="w-full bg-gray-800 border border-gray-700 p-2 rounded"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="body"
          placeholder="Write your post..."
          className="w-full bg-gray-800 border border-gray-700 p-2 rounded h-40"
          value={form.body}
          onChange={handleChange}
          required
        />

        <div className='flex justify-center'>
          <button
            type="submit"
            disabled={!selectedCommunity}
            className={`${selectedCommunity
              ? 'bg-reddit_orange hover:bg-orange-600'
              : 'bg-gray-600 cursor-not-allowed'
              } text-white py-2 px-6 rounded cursor-pointers`}
          >
            {isEdit ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostsForm;
