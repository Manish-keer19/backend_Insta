import { Router } from "express";
import { authentication } from "../middleware/authantication";
import { createPost, deletePost } from "../controllers/Post.controller";

const Postroute = Router();

Postroute.post("/createpost", authentication, createPost);
Postroute.post("/deletePost", authentication, deletePost);

export default Postroute;
