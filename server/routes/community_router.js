import express from "express";
import Community from '../models/Community.js';
import auth from "../middlewares/auth.js";
import mongoose from "mongoose";
import Posts from "../models/Post.js";

const router = express.Router();

// Create a new community
router.post('/', auth.getToken, async (req, res) => {
    const { name, desc } = req.body;

    if (!name || !desc) {
        return res.status(400).json({ error: 'Name and description are required' });
    }

    const authorId = req.userInfo.id;

    try {
        // Check for existing community
        const exists = await Community.exists({ name: name.trim() });
        if (exists) {
            return res.status(409).json({ error: 'Community name already exists' });
        }

        const newCommunity = new Community({
            name: name.trim(),
            desc: desc.trim(),
            author: authorId,
            members: [authorId]
        });

        await newCommunity.save();
        console.log("Community created successfully")
        res.status(201).json({ message: 'Community created successfully', community: newCommunity });
    } catch (err) {
        console.error('Failed to create community:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Find communities where the logged-in user is a member
router.get("/my-communities", auth.getToken, async (req, res) => {
    const userId = req.userInfo.id;

    try {
        // Find communities where the logged-in user is a member
        const communities = await Community.find({
            members: userId,
        });

        // If no communities are found
        if (!communities.length) {
            return res.status(404).json({ message: 'No communities found' });
        }

        res.json(communities);
    } catch (error) {
        console.error('Error fetching communities:', error);
        res.status(500).json({ error: 'Failed to fetch communities', message: error.message });
    }
});


// Check if a community name already exists
router.get('/check-name', async (req, res) => {
    const { name } = req.query;

    if (!name) return res.status(400).send(false);

    try {
        const exists = await Community.exists({ name: name.trim() });
        res.send(Boolean(exists));
    } catch (err) {
        console.error('Error checking community name:', err);
        res.status(500).send(false);
    }
});

//get all communities
router.get('/', async (req, res) => {
    try {
        const communities = await Community.find({});
        console.log("afd");
        console.log(communities);
        res.json(communities);
    } catch (err) {
        console.error('Error getting all communities:', err);
        res.status(500).send(false);
    }
});

//search for communities - used on search page
router.get('/searchCommunities', async (req, res) => {

    const searchTerm = req.query.search;


    if (!searchTerm) {
        return res.status(400).json({ message: 'Search term is required' });
    }

    const searchTerms = searchTerm.split(/\s+/);

    try {
        const query = {
            $or: searchTerms.map(term => ({
                $or: [
                    // { title: { $regex: `\\b${term}\\b`, $options: 'i' } },
                    // { content: { $regex: `\\b${term}\\b`, $options: 'i' } }
                    { name: { $regex: `${term}`, $options: 'i' } },
                    { desc: { $regex: `${term}`, $options: 'i' } }
                ]
            }))
        };

        const results = await Community.find(query);

        console.log(results);

        // if (results.length === 0) {
        //   return res.status(404).json({ message: 'No posts found' });
        // }

        res.json(results);
    } catch (error) {
        console.error('Error occurred while searching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//join a community
router.post('/:name/join', auth.getToken, async (req, res) => {
    try {
        const { name } = req.params;
        const userId = req.userInfo.id;

        const community = await Community.findOne({ name });
        if (!community) return res.status(404).json({ message: 'Community not found' });

        if (community.members.includes(userId)) {
            return res.status(400).json({ message: 'Already a member' });
        }

        community.members.push(userId);
        console.log(community.members);
        await community.save();

        res.status(200).json({ message: 'Joined community' });
    } catch (err) {
        res.status(500).json({ message: 'Error joining community' });
    }
});

//leave a community
router.delete('/:name/leave', auth.getToken, async (req, res) => {
    try {
        const { name } = req.params;
        const userId = req.userInfo.id;

        console.log("in /:name/delete");
        console.log(`${name} - ${userId}`);

        const community = await Community.findOne({ name });
        if (!community) return res.status(404).json({ message: 'Community not found' });

        if (!community.members.includes(userId)) {
            return res.status(400).json({ message: 'You are not a member' });
        }

        community.members = community.members.filter(
            (memberId) => memberId.toString() !== userId.toString()
        );
        await community.save();

        res.status(200).json({ message: 'Left community' });
    } catch (err) {
        res.status(500).json({ message: 'Error leaving community' });
    }
});

//get a community by name
router.get('/:name', async (req, res) => {
    const community = await Community.findOne({ name: req.params.name }).populate('members', '_id');
    if (!community) return res.status(404).send('Not found');
    res.json(community);
});

//get a community by id
router.get('/id/:id', async (req, res) => {
    // if(!req.params.id){
    //     return res.status(400).send('community id is required');
    // }
    const community = await Community.findOne({ _id: req.params.id });
    if (!community) return res.status(404).send('Not found');
    res.json(community);
});

//get all the posts made in a community.
router.get("/community/:communityId/posts", async (req, res) => {
    try {
        const { communityId } = req.params;

        // if(!req.params.id){
        //     return res.status(400).send('community id is required');
        // }

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(communityId)) {
            return res.status(400).json({ message: "Invalid community ID" });
        }

        const posts = await Posts.find({ communityId })
            .populate("userId", "username") // populate author
            .sort({ createdAt: -1 }); // optional: newest first

        res.status(200).json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Server error" });
    }
});



export default router;