import express from "express";
import auth from "../middlewares/auth.js";
import Follow from "../models/Follow.js";

const router = express.Router();

router.post("/follow", auth.getToken, async (req, res) => {
    try {
        const followerId = req.userInfo.id;
        const { followingId } = req.body;

        if (followerId === followingId) {
            return res.status(400).json({ message: "You can't follow yourself." });
        }

        const follow = await Follow.findOneAndUpdate(
            { followerId, followingId },
            {},
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({ message: "Followed successfully", follow });
    } catch (err) {
        console.error("Follow error:", err);
        res.status(500).json({ message: "Server error" });
    }
});


// POST /unfollow
router.post("/unfollow", auth.getToken, async (req, res) => {
    try {
        const followerId = req.userInfo.id;
        const { followingId } = req.body;

        const result = await Follow.deleteOne({ followerId, followingId });

        return res.status(200).json({ message: "Unfollowed", deleted: result.deletedCount > 0 });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


// Get followers of a user
router.get("/:userId/followers", async (req, res) => {
    const followers = await Follow.find({ followingId: req.params.userId }).populate("followerId", "username");
    res.json(followers);
});

// Get users a user is following
router.get("/:userId/following", async (req, res) => {
    const following = await Follow.find({ followerId: req.params.userId }).populate("followingId", "username");
    res.json(following);
});


// GET /isFollowing/:targetUserId
router.get("/isFollowing/:targetUserId", auth.getToken, async (req, res) => {
    try {
        const followerId = req.userInfo.id;               // Logged-in user
        const followingId = req.params.targetUserId;      

        if (followerId === followingId) {
            return res.json({ isFollowing: false });
        }

        const isFollowing = await Follow.exists({ followerId, followingId });

        res.json({ isFollowing: !!isFollowing });
    } catch (err) {
        console.error("Follow check error:", err);
        res.status(500).json({ message: "Server error checking follow status" });
    }
});


export default router;