import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend the Request interface to include a user property
interface CustomRequest extends Request {
  user?: JwtPayload; // Optional user property
}    

// Authentication middleware
export const authentication = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  // Correct return type as void
  try {
    const token =
      req.body.token || req.header("Authorization")?.replace("Bearer ", "");
    // console.log("Authorization header:", req.header("Authorization"));
    // console.log("Extracted token:", token);
    // console.log("token in authantication", token);
    if (!token) {
      res.status(400).json({
        success: false,
        message: "Token not found token de bhai",
      });
      return; // Use return here to exit the function without returning the response object
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT secret is not defined");
    }

    const payload = jwt.verify(token, JWT_SECRET);

    console.log("payload in authantication", payload);

    // Check if payload is of type JwtPayload
    if (typeof payload === "object") {
      req.user = payload as JwtPayload;
    }

    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while verifying the token",
      // error: (error as Error).message,
    });
    return; // Use return to exit the function here too
  }
};
