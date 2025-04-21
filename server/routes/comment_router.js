import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.js";
import Comment from '../models/Comment.js';
import Vote from '../models/Vote.js';
import mongoose from "mongoose";

//gets all the comments for a specific post
router.get("/all/:postId/", (req, res) => {
  try {
    const { postId } = req.params;

    // Validate if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).send({ message: `Invalid postId: ${postId}` });
    }

    Comment.find({ postId: req.params.postId }).populate({ path: 'userId', select: 'username' }).exec().then((comments) => {
      res.send(comments);
    }).catch((error) => res.status(500).send({ message: `Error getting comments from database. Error: ${error}` }));
  }
  catch (error) {
    res.status(500).send({ message: `Error getting comments. Error: ${error}` });
  }
});


//adds a comment to the comment table
router.post("/", auth.getToken, async (req, res) => {
  try {
    const { postId, parentId, content } = req.body;

    if (!content || !postId) {
      return res.status(400).json({ error: "Post ID and content are required." });
    }

    const newComment = new Comment({
      userId: req.userInfo.id,
      postId,
      parentId: parentId || null,  // allow top-level comments
      content
    });

    const savedComment = await newComment.save();

    console.log("Comment saved successfully");
    return res.status(201).json(savedComment);

  } catch (error) {
    console.error("Error saving comment:", error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

// router.post("/", auth.getToken, (req, res) => {
//   try {
//     console.log("0 - ", req.body);

//     // if (!content) {
//     //   return res.status(400).json({ error: "User ID and content are required." });
//     // }

//     console.log("1 - ", req.body);

//     const newComment = new Comment({
//       userId: req.userInfo.id,
//       postId: req.body.postId,
//       parentId: req.body.parentId, // == undefined ? "67ef1ff021e35562db8a746a85" : req.body.parentId,
//       content: req.body.content
//     })

//     console.log("2 - ", req.body);

//     newComment.save().then((comment) => {
//       console.log("comment saved successfully");

//       res.send(comment);
//     }).catch((error) => res.status(400).send({ message: `Error saving comment into database. Error: ${error}` }));
//   }
//   catch (error) {
//     console.log(`Error: ${error}`)
//     res.status(500).send({ message: `Error saving comment. Error: ${error}` });
//   }
// });


//update comment
router.put("/:commentId", auth.getToken, async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;
    const userId = req.userInfo.id;

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const comment = await Comment.findOne({ _id: commentId, userId });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found or you're not authorized." });
    }

    comment.content = content;
    await comment.save();

    console.log("Comment updated successfully");
    return res.status(200).json({ message: "Comment updated", comment });

  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
});




//makes a votes on a specific comment
// router.post("/vote/", auth.getToken, async (req, res) => {
//   let { parentId, onModel, direction } = req.body;

//   const userId = req.userInfo.id;
//   const existing_vote = await Vote.findOne({ userId, parentId, onModel });

//   if (existing_vote) {
//     existing_vote.direction = direction;
//     existing_vote.save().then(() => {
//       res.status(200).json({ message: 'Vote updated', vote: existing_vote })
//     });
//   } else {
//     const newVote = new Vote({ userId, parentId, onModel, direction });
//     newVote.save().then(() => {
//       res.status(201).json({ message: 'Vote created', vote: newVote })
//     });
//   }
// });

// router.post("/vote/", auth.getToken, async (req, res) => {
//   try {
//     const { parentId, onModel, direction } = req.body;
//     const userId = req.userInfo.id;

//     const vote = await Vote.findOneAndUpdate(
//       { userId, parentId, onModel },
//       { $set: { direction } },
//       { new: true }
//     );

//     if (vote) {
//       return res.status(200).json({ message: 'Vote updated', vote });
//     }

//     const newVote = await Vote.create({ userId, parentId, onModel, direction });
//     return res.status(201).json({ message: 'Vote created', vote: newVote });

//   } catch (err) {
//     console.error("Vote error:", err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });
// router.post("/vote/", auth.getToken, async (req, res) => {
//   try {
//     const { parentId, onModel, direction } = req.body;
//     const userId = req.userInfo.id;

//     const existingVote = await Vote.findOne({ userId, parentId, onModel });

//     if (existingVote) {
//       if (existingVote.direction === direction) {
//         // Same vote again = toggle (remove it)
//         await Vote.deleteOne({ _id: existingVote._id });
//         return res.status(200).json({ message: "Vote removed" });
//       } else {
//         // Change direction
//         existingVote.direction = direction;
//         await existingVote.save();
//         return res.status(200).json({ message: "Vote updated", vote: existingVote });
//       }
//     }

//     // No vote exists, create new
//     const newVote = await Vote.create({ userId, parentId, onModel, direction });
//     return res.status(201).json({ message: "Vote created", vote: newVote });

//   } catch (err) {
//     console.error("Vote error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/vote/", auth.getToken, async (req, res) => {
  try {
    const { parentId, onModel, direction } = req.body;
    const userId = req.userInfo.id;

    const existingVote = await Vote.findOne({ userId, parentId, onModel });

    if (existingVote) {
      if (existingVote.direction === direction) {
        // Same direction — remove vote
        await Vote.deleteOne({ _id: existingVote._id });
        return res.status(200).json({ message: "Vote removed", active: false });
      } else {
        // Different direction — update
        existingVote.direction = direction;
        await existingVote.save();
        return res.status(200).json({ message: "Vote updated", vote: existingVote, active: true });
      }
    }

    // No vote yet — create new
    const newVote = await Vote.create({ userId, parentId, onModel, direction });
    return res.status(201).json({ message: "Vote created", vote: newVote, active: true });

  } catch (err) {
    console.error("Vote error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});




//gets total votes for a comments
router.get("/:commentId/totalvotes", (req, res) => {
  const parentId = req.params.commentId;

  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    return res.status(400).send({ message: "Invalid commentid format." });
  }

  Vote.find({ parentId: parentId }).then((votes) => {
    let total_votes = 0;
    votes.forEach((vote) => {
      total_votes += vote.direction
    })
    res.json({ total_votes: total_votes });
  });
});

//gets user vote on a specific by a specific user
router.get("/:parentId/getVoteOfUser", auth.getToken, async (req, res) => {
  const start = Date.now();
  try {
    const parentId = req.params.parentId;
    console.log("parent id - ", parentId);

    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).send({ message: "Invalid postId format." });
    }

    const userId = req.userInfo.id;

    const vote = await Vote.findOne({ userId, parentId }).lean();

    console.log("Query took:", Date.now() - start, "ms");

    if (vote) {
      return res.json({ userVote: vote.direction });
    } else {
      return res.json({ userVote: null });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ message: `Error getting user's vote. Error: ${error}` });
  }
});


router.delete("/comments/:id", auth.getToken, async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.userInfo.id;

    console.log("here");
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (!comment.userId.equals(userId)) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    comment.content = "[deleted]";
    comment.userId = null;
    comment.deleted = true;
    comment.deletedAt = new Date();

    await comment.save();

    res.status(200).json({ message: "Comment deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/searchComments', async (req, res) => {

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
          // { title: { $regex: `${term}`, $options: 'i' } },
          { content: { $regex: `${term}`, $options: 'i' } }
        ]
      }))
    };

    let results = await Comment.find(query)//.populate('postId');;
      .populate({
        path: 'postId',
        populate: [
          {
            path: 'userId',
            model: 'User',
            select: 'username email'
          },
          {
            path: 'communityId',
            model: 'Community', 
            select: 'name description'
          }
        ]
      });

    res.json(results);
  } catch (error) {
    console.error('Error occurred while searching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;