import { Router } from "express";
import {
  generateOtp,
  Signup,
  Login,
  IsUsernameAlreadyTaken,
  ResetPassword,
  changePassword,
  sendOtp,
} from "../controllers/auth.controller";
import { authentication } from "../middleware/authantication";
const authRoute = Router();

authRoute.post("/signup", Signup);
authRoute.post("/generateOtp", generateOtp);
authRoute.post("/sendOtp", sendOtp);
authRoute.post("/login", Login);
authRoute.post("/isUsernameAlreadyTaken", IsUsernameAlreadyTaken);
authRoute.post("/resetPassword", ResetPassword);
authRoute.post("/changePassword",authentication ,changePassword);

export default authRoute;
