import { Router } from "express";
import { editProfile } from "../controllers/profile.controller";
import exp from "constants";
import { authentication } from "../middleware/authantication";

const profileRoute = Router();

profileRoute.post("/editProfile", authentication, editProfile);

export default profileRoute;
