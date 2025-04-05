// dummy posts

import express from "express";
const router = express.Router();

let posts = [
    {
        postId: '60c72b2f5f1b2f001f4b8bfa',
        author: 'john_doe',
        title: 'Tell me about your worst mistake on the job',
        body: 'These stories are always a blast. Im curious.',
        postedAt: new Date(),

    },
    {
        postId: '60c72b2f5f1b2f001f4b8bfb',
        author: 'alice_smith',
        body: 'I personally prefer Python because of its simplicity and versatility.',
        postedAt: new Date(),
    },
    {
        postId: '60c72b2f5f1b2f001f4b8bfg',
        author: 'test',
        body: 'testing',
        postedAt: new Date(),
    },
    {
        postId: '60c72b2f5f1b2f001f4b8bfc',
        author: 'bob_jones',
        body: 'JavaScript is my go-to language because of its ability to run in both browsers and servers.',
        postedAt: new Date(),
    },
    {
        postId: '60c72b2f5f1b2f001f4b8bfd',
        author: 'charlie_brown',
        body: 'I enjoy working with Rust due to its memory safety features.',
        postedAt: new Date(),
    },
    {
        postId: '60c72b2f5f1b2f001f4b8bfe',
        author: 'david_lee',
        body: 'I like C++ because of its speed and control over system resources.',
        postedAt: new Date(),

    },
    {
        postId: '60c72b2f5f1b2f001f4b8bff',
        author: 'elizabeth_wood',
        body: 'C# is great for game development, especially with Unity.',
        postedAt: new Date(),

    }
]