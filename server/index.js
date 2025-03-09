import express from "express"; // if you are using type: module
import cors from 'cors';
import cors from 'cors';

import comment_router from './comment_routes.js';

const app = express();
const PORT = process.env.PORT || 8000;
 
// middlelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
 
//comment & votes routes
app.use("/comment", comment_router);

// routes
app.get("/", (req, res) => {
  res.send("Welcome to our server");
});
 
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
 
app.use("", (req, res) => {
  res.status(404).send("Page not found");
});
 
