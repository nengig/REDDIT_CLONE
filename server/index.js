import express from "express"; // if you are using type: module
import cors from 'cors';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as mongoose from "mongoose";
import dotenv from "dotenv";

import comment_router from './routes/comment_router.js';
import user_router from './routes/user_router.js'
import router from './routes/post_router.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT;

// middlelware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // set your front-end origin
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
})
  .catch((error) => console.error("MongoDB connection error:", error));



// routes
app.get("/", (req, res) => {
  res.send("Welcome to our server");
});

app.use("/comment", comment_router); //comment & votes routes
app.use("/user", user_router); //log and register routes
app.use('/posts', router);

app.use("", (req, res) => {
  res.status(404).send("Page not found");
});
