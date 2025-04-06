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
router.post("/", auth.getToken, (req, res) => {
  try {

    if (!content) {
      return res.status(400).json({ error: "User ID and content are required." });
    }

    const newComment = new Comment({
      userId: req.userInfo.id,
      postId: req.body.postId == undefined ? "67ef1005ca7a80336f890bcc" : req.body.postId,
      parentId: req.body.parentId == undefined ? "67ef1ff021e35562db8a746a85" : req.body.parentId,
      content: req.body.content
    })

    newComment.save().then((comment) => {
      console.log("comment saved successfully");

      res.send(comment);
    }).catch((error) => res.status(400).send({ message: `Error saving comment into database. Error: ${error}` }));
  }
  catch (error) {
    res.status(500).send({ message: `Error saving comment. Error: ${error}` });
  }
});

//makes a votes on a specific comment
router.post("/vote/", auth.getToken, async (req, res) => {
  let { parentId, onModel, direction } = req.body;

  const userId = req.userInfo.id;
  const existing_vote = await Vote.findOne({ userId, parentId, onModel });

  if (existing_vote) {
    existing_vote.direction = direction;
    existing_vote.save().then(() => {
      res.status(200).json({ message: 'Vote updated', vote: existing_vote })
    });
  } else {
    const newVote = new Vote({ userId, parentId, onModel, direction });
    newVote.save().then(() => {
      res.status(201).json({ message: 'Vote created', vote: newVote })
    });
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
router.get("/:commentId/getVoteOfUser", auth.getToken, (req, res) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
    return res.status(400).send({ message: "Invalid postId format." });
  }

  const parentId = req.params.commentId;
  const userId = req.userInfo.id;

  Vote.findOne({ userId, parentId }).then((vote) => {
    console.log(vote);
    res.json({ userVote: vote.direction })
  })

});

export default router;