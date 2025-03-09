import express from "express";
const router = express.Router();


let comments = [
  // {
  //   commentId: '60c72b2f5f1b2f001f4b8bfa',
  //   author: 'john_doe',
  //   title: 'What is your favorite programming language?',
  //   body: 'I am curious to know what programming languages people prefer and why.',
  //   postedAt: new Date('2025-03-07T12:00:00Z'),
  //   parentId: null,
  //   rootId: '60c72b2f5f1b2f001f4b8bf9', // Post ID
  // },
  {
    commentId: '60c72b2f5f1b2f001f4b8bfb',
    author: 'alice_smith',
    body: 'I personally prefer Python because of its simplicity and versatility.',
    postedAt: new Date('2025-03-07T12:10:00Z'),
    parentId: '60c72b2f5f1b2f001f4b8bfa', // Parent comment ID
    rootId: '60c72b2f5f1b2f001f4b8bf9', // Post ID
  },
  {
    commentId: '60c72b2f5f1b2f001f4b8bfg',
    author: 'test',
    body: 'testing',
    postedAt: new Date(),
    parentId: '60c72b2f5f1b2f001f4b8bfb', // Parent comment ID
    rootId: '60c72b2f5f1b2f001f4b8bf9', // Post ID
  },
  {
    commentId: '60c72b2f5f1b2f001f4b8bfc',
    author: 'bob_jones',
    body: 'JavaScript is my go-to language because of its ability to run in both browsers and servers.',
    postedAt: new Date('2025-03-07T12:15:00Z'),
    parentId: '60c72b2f5f1b2f001f4b8bfa', // Parent comment ID
    rootId: '60c72b2f5f1b2f001f4b8bf9', // Post ID
  },
  {
    commentId: '60c72b2f5f1b2f001f4b8bfd',
    author: 'charlie_brown',
    body: 'I enjoy working with Rust due to its memory safety features.',
    postedAt: new Date('2025-03-07T12:20:00Z'),
    parentId: '60c72b2f5f1b2f001f4b8bfa', // Parent comment ID
    rootId: '60c72b2f5f1b2f001f4b8bf9', // Post ID
  },
  {
    commentId: '60c72b2f5f1b2f001f4b8bfe',
    author: 'david_lee',
    body: 'I like C++ because of its speed and control over system resources.',
    postedAt: new Date('2025-03-07T12:30:00Z'),
    parentId: null,
    rootId: '60c72b2f5f1b2f001f4b8bf9', // Post ID
  },
  {
    commentId: '60c72b2f5f1b2f001f4b8bff',
    author: 'elizabeth_wood',
    body: 'C# is great for game development, especially with Unity.',
    postedAt: new Date('2025-03-07T12:40:00Z'),
    parentId: null,
    rootId: '60c72b2f5f1b2f001f4b8bf9', // Post ID
  },
  {
    commentId: '2a',
    author: 'test',
    postedAt: '2025-03-08T22:07:58.146Z',
    body: 'test',
    parentId: '1',
    rootId: '0'
  },
];

let id = 3;

router.get("/comments", (req, res) => {
  // console.log(comments);
  const sortedComments = comments.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
  console.log("Sorted");
  console.log(sortedComments);
  res.send(sortedComments)
})

router.post("/comment", (req, res) => {
  const newComment = { commentId: `${id++}a`, ...req.body };
  comments = [...comments, newComment];
  console.log(comments);
  res.send(newComment)
});

let vote_data = [
  {
    author: "alice_williams",
    parentId: "2a", // Example ObjectId
    direction: 1
  },
  {
    author: "mark_taylor",
    parentId: "2a", // Example ObjectId
    direction: 1
  },

  {
    author: "lucy_jones",
    parentId: "2a", // Example ObjectId
    direction: 1
  }
];



router.post("/vote/:commentId/", (req, res) => {

  const existing_author = vote_data.filter(vote => vote.author == "jane_smith" && vote.parentId == req.params.commentId);

  // console.log(p)
  // console.log("Existing author");
  // console.log(existing_author.length > 0 ? "true" : "false");

  if (existing_author.length > 0) {
    // vote_data.find(vote => vote.author == "jane_smith" && vote.parentId == req.params.commentId).direction = (req.body.vote === 'up' ? 1 : -1);
    let vote = vote_data.find(vote => vote.author == "jane_smith" && vote.parentId == req.params.commentId);
    if (vote.direction == (req.body.vote == 'up' ? 1 : -1)) {
      vote_data = vote_data.filter(vote => !(vote.author == "jane_smith" && vote.parentId == req.params.commentId)) ;
      console.log("dfjlaksdfalkdfaw0909e8r09q8ew0r98qw0e9r");
      console.log(vote_data);
    }
    else {
      vote_data.find(vote => vote.author == "jane_smith" && vote.parentId == req.params.commentId).direction = (req.body.vote === 'up' ? 1 : -1);
    }
    console.log("in existing user");
  }
  else {

    const newVote = {
      author: "jane_smith",
      parentId: req.params.commentId,
      direction: req.body.vote == 'up' ? 1 : -1
    }

    vote_data = [...vote_data, newVote];
    console.log("in new voter");
  }

  let total_votes = 0;
  console.log(vote_data);
  console.log("------");
  console.log(vote_data.filter(vote => vote.parentId == req.params.commentId))
  vote_data.filter(vote => vote.parentId == req.params.commentId)?.forEach(vote => { total_votes += vote.direction; console.log(vote.direction) });


  console.log("-->>" + total_votes);

  res.send(total_votes.toString());
});

router.post("/votes", (req, res) => {
  const commentIds = req.body.comment_ids;
  console.log(commentIds);

  const username = "jane_smith";

  const matchingElements = [];
  vote_data.forEach(item => {
    console.log(item.parentId);
    console.log(item.parentId && commentIds.includes(item.parentId.toString()));
    if (commentIds.includes(String(item.parentId))) {
      matchingElements.push(item);
    }
  });

  console.log(matchingElements);

  let comment_totals = {};
  let userVotes = {};
  matchingElements.forEach(vote => {
    if (typeof comment_totals[vote.parentId] === 'undefined') {
      comment_totals[vote.parentId] = 0;
    }
    comment_totals[`${vote.parentId}`] += vote.direction;
    if (vote.author == username) {
      userVotes[vote.parentId] = vote.direction;
    }
  });

  res.send(JSON.stringify({ body: { comment_totals, userVotes } }));

})


router.use("", (req, res) => {
  res.status(404).send("Page not found");
});


export default router;