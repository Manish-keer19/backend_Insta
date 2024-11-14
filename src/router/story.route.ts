// import { Router } from "express";
// import { authentication } from "../middleware/authantication";
// import { createStory } from "../controllers/Story.Controller";

// const storyRoute = Router();

// storyRoute.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// storyRoute.post("/createStory", authentication, createStory);

// export default storyRoute;

import { RequestHandler, Router } from "express";
import { authentication } from "../middleware/authantication"; // Ensure your authentication middleware adds 'user'
import {
  adduserToStory,
  createStory,
  deleteStory,
  getFolllowersStories,
  getStory,
} from "../controllers/Story.Controller";

const storyRoute = Router();

storyRoute.post(
  "/createStory",
  authentication,
  createStory as unknown as RequestHandler
);
storyRoute.post(
  "/deleteStory",
  authentication,
  deleteStory as unknown as RequestHandler
);
storyRoute.post(
  "/adduserToStory",
  authentication,
  adduserToStory as unknown as RequestHandler
);
storyRoute.get("/getStory/:id", getStory);
storyRoute.post("/getFolllowersStories", authentication,getFolllowersStories as unknown as RequestHandler);

export default storyRoute;
