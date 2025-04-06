// middlewares/auth.js
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '6d' } // Set token expiration time (6 day in this case)
  );
};

// Middleware to verify and get the JWT token
const getToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "no user logged in" });
  }
  try {
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to the request object
    req.userInfo = userInfo;
    next(); // Pass control to the next middleware/handler
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid token." });
  }
};

export default { generateToken, getToken };
