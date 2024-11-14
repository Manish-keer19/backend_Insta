import { RequestHandler, Router } from "express";
import {
  chnageProfilePic,
  featchUserData,
  fetchUserFeed,
  fetchUserFollowingList,
  FollowUser,
  getuserFulldata,
  searchUserInMessage,
  searchUsers,
  UnFollowUser,
} from "../controllers/User.controller";
import { authentication } from "../middleware/authantication";

const userRoute = Router();

// Basic GET route
userRoute.get("/", (req, res) => {
  res.send("Hello World!");
});

userRoute.post("/getuserFulldata", getuserFulldata);
userRoute.post("/followuser", authentication, FollowUser);
userRoute.post("/unFollowUser", authentication, UnFollowUser);
userRoute.post("/searchUsers", authentication, searchUsers);
userRoute.post("/fetchUserFeed", authentication, fetchUserFeed);
userRoute.post(
  "/fetchUserFollowingList",
  authentication,
  fetchUserFollowingList as unknown as RequestHandler
);
userRoute.post("/searchUserInMessage", authentication, searchUserInMessage);
userRoute.post("/fetchUserdata", featchUserData);
userRoute.post("/chnageProfilePic", chnageProfilePic);
export default userRoute;
