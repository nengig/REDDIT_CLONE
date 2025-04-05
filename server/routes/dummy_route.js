import express from "express";
import users from "../user.js";
//dummy endpoints
const router = express.Router();
let loggedInUser = null;
router.get("/getUser", (req, res) => {
    if (loggedInUser) {
        res.status(200).json({
            username: loggedInUser.username,
            email: loggedInUser.email, // For demonstration only; avoid exposing passwords in real apps
        });
    } else {
        res.status(404).json({ message: "No user logged in" });
    }
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists and the password matches
    const user = users.find(
        (user) => user.username === username && user.password === password
    );

    if (user) {
        loggedInUser = user;
        // In a real app, you'd create a session or a JWT token here
        res.status(200).json({
            message: "Login successful",
            user: {
                username: user.username,
                email: user.email,
            },
        });
    } else {
        res.status(401).json({
            message: "Invalid username or password",
        });
    }
});

router.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    // Check if username already exists
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Register the new user
    const newUser = { username, email, password };
    users.push(newUser); // Store the new user (in real apps, this would be a database save)

    res.status(200).json({
        message: "Registration successful",
        user: {
            username: newUser.username,
            email: newUser.email,
        },
    });
});

// Dummy logout endpoint
router.post("/logout", (req, res) => {
    loggedInUser = null; // Clear logged-in user data
    res.status(200).json({ message: "Logout successful" });
});  
export default router