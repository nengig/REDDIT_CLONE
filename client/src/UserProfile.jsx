import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from './UserContext';
import Avatar from './avatar.png';

export default function UserProfile() {
    // your context merges user fields + methods (getUser, setUser, logout)
    const user = useContext(UserContext);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [form, setForm] = useState({ username: '', email: '' });
    const [passForm, setPassForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    // fetch fresh user on mount
    useEffect(() => {
        user.getUser();
    }, []);

    // populate profile form when user data arrives
    useEffect(() => {
        if (user.username) {
            setForm({ username: user.username, email: user.email });
        }
    }, [user.username, user.email]);

    // guard before data loads
    if (!user.username) {
        return (
            <div className="min-h-screen bg-reddit_dark text-reddit-text flex items-center justify-center">
                <p>Loading profile…</p>
            </div>
        );
    }

    const cakeDay = new Date(user.createdAt).toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

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
                user.setUser(updated);
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
        if (
            window.confirm(
                'Are you sure you want to delete your account? This cannot be undone.'
            )
        ) {
            axios
                .delete(
                    `${import.meta.env.VITE_SERVER_URL}user/delete`,
                    { withCredentials: true }
                )
                .then(() => {
                    user.logout();
                    navigate('/');
                })
                .catch(err => {
                    setError(err.response?.data?.error || 'Account deletion failed');
                });
        }
    };

    return (
        <div className="min-h-screen bg-reddit_dark text-gray-400 p-6 flex justify-center">
            <div className="w-full max-w-lg bg-reddit-dark-brighter rounded-lg shadow-lg overflow-hidden">

                {/* Header */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-reddit-border rounded-full flex items-center justify-center text-2xl font-bold  text-gray-400 overflow-hidden">
                            <img
                                src={Avatar}
                                alt=""
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">{user.username}</h1>
                            <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setIsChangingPassword(false);
                            setIsEditing(v => !v);
                            setError('');
                        }}
                        className="px-4 py-2 bg-reddit-orange  text-gray-400 rounded hover:text-white transition"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {/* Profile Edit Form */}
                {isEditing && (
                    <form onSubmit={handleSubmit} className="p-6 border-t border-reddit-border space-y-4">
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
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-reddit-orange  text-gray-400 rounded hover:text-white transition"
                        >
                            Save Changes
                        </button>
                    </form>
                )}

                {/* Change Password */}
                {!isEditing && (
                    <div className="border-t border-reddit-border p-6 space-y-4">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setIsChangingPassword(v => !v);
                                setError('');
                            }}
                            className="w-full px-4 py-2 bg-reddit-dark-brightest text-gray-400 rounded hover:text-white transition"
                        >
                            {isChangingPassword ? 'Cancel Password Change' : 'Change Password'}
                        </button>

                        {isChangingPassword && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-3 pt-4">
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
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-reddit-orange  text-gray-400 rounded hover:text-white transition"
                                >
                                    Update Password
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* Cake‑day & Delete Account */}
                {!isEditing && !isChangingPassword && (
                    <div className="border-t border-reddit-border p-6 space-y-4">
                        <div>
                            <h2 className="text-sm text-gray-400 mb-1">Cake‑day</h2>
                            <p className="font-medium">{cakeDay} 🎂</p>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <button
                            onClick={handleDelete}
                            className="w-full px-4 py-2 bg-red-600  text-white rounded hover:bg-red-700 transition"
                        >
                            Delete Account
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}


