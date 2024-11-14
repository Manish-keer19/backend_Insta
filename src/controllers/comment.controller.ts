import { Request, Response } from "express"; // Ensure to import Request, Response from express
import { Comment } from "../models/comment.model"; // Assuming your Comment model is defined in this path
import { Post } from "../models/Post.model";
import { User } from "../models/User.model";
import { fetchAllDetailsUser } from "../utils/fetchAllDetailsUser";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    // Fetch the data from req.body
    const { comment, postId } = req.body;

    // Fetch user from req.user
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Log details to ensure data is being passed correctly
    console.log("user is ", user);
    console.log("comment is ", comment);
    console.log("postId is ", postId);

    // Validate comment and postId
    if (!comment || !postId) {
      return res.status(400).json({
        success: false,
        message: "Comment and postId are required",
      });
    }

    // Check if post exists
    const isPostExist = await Post.findById(postId);
    if (!isPostExist) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create comment entry in the database
    const newComment = await Comment.create({
      comment,
      user: user.id, // Store the user's ID
      post: postId,
    });

    // Update the post model by pushing the comment ID
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comment: newComment._id }, // Assuming 'comment' is an array in the Post schema
      },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const userdata = await fetchAllDetailsUser(user.email);

    // Return the created comment
    return res.status(200).json({
      success: true,
      message: "Comment created successfully",
      userdata,
    });
  } catch (error: any) {
    console.error("Could not create the comment", error);
    return res.status(500).json({
      success: false,
      message: "Could not create the comment",
      error: error.message, // Include error details for easier debugging
    });
  }
};

export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  // fetch the commnet id from req.body
  // validate it
  // check if comment exists
  // update the post and user model
  // delete the comment
  // return success response
  try {
    // fetch the commnet id from req.body
    const { commentId } = req.body;
    const user = req.user;
    console.log("user is ", user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    console.log("commentId is ", commentId);

    // validate it
    if (!commentId) {
      return res.status(400).json({
        success: false,
        message: "Comment ID is required",
      });
    }
    // check if comment exists
    const isCommentExist = await Comment.findById(commentId);
    if (!isCommentExist) {
      return res.status(404).json({
        success: false,
        message: "Comment does not exist",
      });
    }

    // delete the comment
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // update the post and user model
    const updatedPost = await Post.findOneAndUpdate(
      { comment: commentId },
      { $pull: { comment: commentId } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userdata = await fetchAllDetailsUser(req.user?.email);
    if (!userdata) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("userdata in delete comment is ", userdata);
    // return success response
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      userdata,
    });
  } catch (error: any) {
    console.log("could not delete the comment", error);
    return res.status(500).json({
      success: false,
      message: "Could not delete the comment",
      error: error.message, // Include error details for easier debugging
    });
  }
};
