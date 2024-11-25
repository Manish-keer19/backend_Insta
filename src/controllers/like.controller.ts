import { Request, Response } from "express";
import { Post } from "../models/Post.model";
import { User } from "../models/User.model";
import mongoose, { Mongoose, Types } from "mongoose";
import { fetchAllDetailsUser } from "../utils/fetchAllDetailsUser";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const createLike = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    // Fetch the data from postId
    const { postId } = req.body;
    // console.log("postId is", postId);

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "postId is required",
      });
    }

    const ispostExist = await Post.findOne({ _id: postId });
    if (!ispostExist) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    // Fetch the user data from req.user
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    // console.log("user is", user);

    // Check if the user has already liked the post
    const userId = new mongoose.Types.ObjectId(user.id);
    if (ispostExist.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You have already liked this post",
      });
    }

    // push the user into post's likes array
    const newPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { likes: user.id } },
      { new: true }
    );

    const userdata = await fetchAllDetailsUser(user.email);
    // console.log("userdata is ", userdata);

    // Return response
    return res.status(200).json({
      success: true,
      message: "Like created successfully",
      userdata,
    });
  } catch (error) {
    // console.log("Could not create the like", error);
    return res.status(400).json({
      success: false,
      message: "Could not create the like",
    });
  }
};

export const deleteLike = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "postId is required",
      });
    }
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const ispostExist = await Post.findOne({ _id: postId });
    if (!ispostExist) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = new mongoose.Types.ObjectId(user.id);
    if (!ispostExist.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You have not liked this post",
      });
    }

    //  update the post model delete like
    const newPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $pull: { likes: userId },
      },
      { new: true }
    );
    // console.log("newpost after delete like is ", newPost);
    if (!newPost) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    const userdata = await fetchAllDetailsUser(user.email);
    // console.log("userdata is ", userdata);

    return res.status(200).json({
      success: true,
      message: "Like deleted successfully",
      userdata,
    });
  } catch (error: any) {
    // console.log("could not delete the like ", error);
    return res.status(400).json({
      success: false,
      message: "could not delete the like",
      error: error.message,
    });
  }
};
