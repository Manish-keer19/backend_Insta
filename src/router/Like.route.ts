import { Router } from "express";
import { createLike, deleteLike } from "../controllers/like.controller";
import { authentication } from "../middleware/authantication";

const likeRoute = Router();

likeRoute.route("/createLike").post(authentication, createLike);
likeRoute.route("/deleteLike").post(authentication, deleteLike);

export default likeRoute;
