import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Posts from "../models/Post.js";
import auth from "../middlewares/auth.js"
import Comment from "../models/Comment.js";
import Community from "../models/Community.js";

import Follow from "../models/Follow.js";

const router = express.Router();
router.get("/getUser", auth.getToken, async (req, res) => {
    const userInfo = req.userInfo
    try {
        const user = await User
            .findById(userInfo.id)
            .select('-password')
            .populate('posts')        // pulls in Posts documents
            .populate('comments');    // pulls in Comment documents
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json(user);

    } catch (error) {
        console.error("error finding user:", error);
        res.status(500).json({ message: "error finding user", error: error.message });
    }
});

router.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    // Validate required fields
    if (!email || !password || !username) {
        return res.status(400).json({ message: "credentials are required." });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'password must be at least 8 characters.' });
    }
    try {
        // Check if a user with the provided email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "user already exists with this email" });
        }

        // Check if a user with the provided username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "user already exists with this username" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();

        // Generate a token and set it as a cookie
        const token = auth.generateToken(newUser);
        res.cookie('token', token);

        // Send success response
        res.status(201).json({ message: `User ${username} registered successfully` });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "error registering user. try again later", error: error.message });
    }
});

router.post("/logout", (req, res) => {
    res.cookie('token', '')
    res.json({ message: "logout successful" });
})
router.post("/login", async (req, res) => {
    const { username, password } = req.body
    // Validate required fields
    if (!password || !username) {
        return res.status(400).json({ message: "credentials are required." });
    }
    try {
        //find user with username
        const user = await User.findOne({ username });
        //user not found
        if (!user) {
            return res.status(400).json({ message: "invalid username" });
        }

        //user found. compare password
        const passOk = await bcrypt.compare(password, user.password)

        //password does not match
        if (!passOk) {
            return res.status(400).json({ message: "invalid password" });
        }

        res.cookie('token', auth.generateToken(user)); // Generate JWT token and send as cookie
        res.json({ message: `welcome back, ${username}` });


    } catch (error) {
        console.error("error logging in user:", error);
        res.status(500).json({ message: "error logging in. try again later", error: error.message });
    }
})

// router.put('/updateUser', auth.getToken, async (req, res) => {
//     const { username, email } = req.body;
//     const userId = req.userInfo.id; // or whatever you encoded in your token

//     try {
//         // Check uniqueness of email (exclude current user)
//         const emailTaken = await User.findOne({
//             email,
//             _id: { $ne: userId }
//         });
//         if (emailTaken) {
//             return res.status(400).json({ error: 'Email already in use' });
//         }

//         // Check uniqueness of username
//         const usernameTaken = await User.findOne({
//             username,
//             _id: { $ne: userId }
//         });
//         if (usernameTaken) {
//             return res.status(400).json({ error: 'Username already in use' });
//         }

//         // Perform the update
//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { username, email },
//             { new: true, runValidators: true }
//         ).select('-password');  // omit password in response

//         res.json(updatedUser);
//     } catch (error) {
//         console.error('error updating profile', error);
//         res.status(500).json({ message: "error changing password. try again later", error: error.message });
//     }
// });


router.put('/updateUser', auth.getToken, async (req, res) => {
    const { username, email } = req.body;
    const userId = req.userInfo.id;

    try {
        // Check uniqueness of email
        const emailTaken = await User.findOne({
            email,
            _id: { $ne: userId }
        });
        if (emailTaken) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Check uniqueness of username
        const usernameTaken = await User.findOne({
            username,
            _id: { $ne: userId }
        });
        if (usernameTaken) {
            return res.status(400).json({ error: 'Username already in use' });
        }

        // Fetch old user to get current username
        const currentUser = await User.findById(userId);

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true }
        ).select('-password');

        // Update all posts authored by the old username
        await Posts.updateMany(
            { author: "u/" + currentUser.username },
            { author: "u/" + username }
        );

        res.json(updatedUser);
    } catch (error) {
        console.error('error updating profile', error);
        res.status(500).json({ message: "error changing profile. try again later", error: error.message });
    }
});


router.put('/changePassword', auth.getToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userInfo.id;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'both current and new password are required.' });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'new password must be at least 8 characters.' });
    }

    try {
        // 1) Fetch the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user not found.' });
        }

        // 2) Verify current password
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(400).json({ message: 'current password is incorrect.' });
        }

        // 3) Hash & update to new password
        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.json({ message: 'password updated successfully.' });
    } catch (error) {
        console.error("error changing password:", error);
        res.status(500).json({ message: "error changing password. try again later", error: error.message });
    }
});

// router.delete('/delete', auth.getToken, async (req, res) => {
//     const userId = req.userInfo.id;
//     try {
//         // Optionally: remove all user‑owned data here (posts, comments, etc.)

//         // Delete the user
//         await User.findByIdAndDelete(userId);

//         // Clear the auth cookie
//         res.clearCookie('token');

//         res.json({ message: 'account deleted successfully.' });
//     } catch (error) {
//         console.error("error deleting account:", error);
//         res.status(500).json({ message: "error deleting account. try again later", error: error.message });
//     }
// });

router.delete('/delete', auth.getToken, async (req, res) => {
    const userId = req.userInfo.id;

    try {
        await Posts.updateMany(
            { userId },
            {
                $set: {
                    author: '[deleted]',
                    userId: null
                }
            }
        );

        await Comment.updateMany(
            { userId },
            {
                $set: {
                    userId: null
                }
            }
        );

        await Follow.deleteMany({ $or: [{ followerId: userId }, { followingId: userId }] });

        await Community.updateMany(
            { members: userId },
            { $pull: { members: userId } }
        );
        await User.findByIdAndDelete(userId);
        res.clearCookie('token');

        res.json({ message: 'Account deleted successfully. Content preserved, user identity removed.' });

    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({
            message: "Error deleting account. Try again later.",
            error: error.message
        });
    }
});


router.get('/searchUsers', async (req, res) => {
    const searchTerm = req.query.search;

    if (!searchTerm) {
        return res.status(400).json({ message: 'Search term is required' });
    }

    const searchTerms = searchTerm.split(/\s+/);

    try {
        const query = {
            $or: searchTerms.map(term => ({
                $or: [
                    { username: { $regex: `${term}`, $options: 'i' } },
                ]
            }))
        };

        const results = await User.find(query).select('username');;

        console.log(results);

        res.json(results);
    } catch (error) {
        console.error('Error occurred while searching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.get("/u/:username", async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User
            .findOne({ username: username })
            .select('-password')
            .populate('posts')        // pulls in Posts documents
            // .populate('comments');    // pulls in Comment documents
            .populate({
                path: 'comments',
                populate: {
                    path: 'postId',
                }
            });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        console.log(user);

        res.json(user);

    } catch (error) {
        console.error("error finding user:", error);
        res.status(500).json({ message: "error finding user", error: error.message });
    }
});


export default router