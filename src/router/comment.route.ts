import { Router } from "express";
import { authentication } from "../middleware/authantication";
import {
  createComment,
  deleteComment,
} from "../controllers/comment.controller";
const commentRoute = Router();

commentRoute.route("/createcomment").post(authentication, createComment);
commentRoute.route("/deleteComment").post(authentication, deleteComment);

export default commentRoute;
