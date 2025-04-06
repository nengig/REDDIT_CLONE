import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middlewares/auth.js"

const router = express.Router();
router.get("/getUser", auth.getToken, async (req, res) => {
    const userInfo = req.userInfo
    try{
        const user = await  User.findById(userInfo.id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json({ username: user.username });

    }catch(error){
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
    if ( !password || !username) {
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



export default router