import { Request, Response } from "express";
import { User } from "../models/User.model";
import mongoose, { mongo } from "mongoose";
import { fetchAllDetailsUser } from "../utils/fetchAllDetailsUser";
import { emit } from "process";
import { uploadInCloudinary } from "../utils/cloudinary.utils";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}
export const FollowUser = async (req: Request, res: Response): Promise<any> => {
  // fetch the token and userId where current user wants to follow that user
  // fetch the current user id from req.user.id
  // validate all of these
  // check if user exists based on userId
  // add following array of current user
  // and also add followers array of another user that has been followed
  // save both of them
  // return success response

  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const { userId, token } = req.body;

    // console.log("userid is ", userId);
    // console.log("token is ", token);
    // validate
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    // console.log("authuser is ", authenticatedReq.user);
    const currentUserId = authenticatedReq.user.id;
    // console.log("currentuserId", currentUserId);

    if (!currentUserId) {
      return res.status(400).json({
        success: false,
        message: "currentUserId is required",
      });
    }

    const isCurrentUserExist = await User.findOne(
      { _id: currentUserId },
      {},
      { new: true }
    );

    if (!isCurrentUserExist) {
      return res.status(400).json({
        success: false,
        message: "current user is not found",
      });
    }

    if (isCurrentUserExist.following.some((el) => el._id == userId)) {
      return res.json({
        success: false,
        message: "you have already followed the user",
      });
    }

    const isUserExist = await User.findOne({ _id: userId });
    if (!isUserExist) {
      return res.status(400).json({
        success: false,
        message: "follower user not found",
      });
    }

    // add following array of current user
    const currentUser = await User.findByIdAndUpdate(
      currentUserId,
      {
        $push: {
          following: userId,
        },
      },
      { new: true }
    );

    // console.log("current user is ", currentUser);

    if (!currentUser) {
      return res.json({
        success: false,
        message: "current user is null",
      });
    }

    // update the followers array of another user that has been followed

    const anotherUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          followers: currentUserId,
        },
      },
      { new: true }
    );
    // console.log("another user is ", anotherUser);

    if (!anotherUser) {
      return res.json({
        success: false,
        message: "another user is null",
      });
    }

    // success response

    const userdata = await fetchAllDetailsUser(authenticatedReq.user.email);

    return res.status(200).json({
      success: true,
      message: "successfully followed the user",
      userdata,
    });
  } catch (error) {
    // console.log("could not follow the user", error);
    return res.status(500).json({
      success: false,
      message: "Could not follow the user",
    });
  }
};

export const UnFollowUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  //  fetch the target user id that want to unfollow from req.body
  //  fetch the current user id that want to unfollowe the targetUser
  // validtae both
  // remove followings array from currentuser
  // remove followerss array from target user
  // return success response

  try {
    const authenticatedReq = req as AuthenticatedRequest;

    const { userId, token } = req.body;
    // console.log("userId", userId);
    // console.log("token is ", token);

    if (!userId || !token) {
      return res.json({
        success: false,
        message: "userId and token both required",
      });
    }

    const currentUserId = authenticatedReq.user.id;
    // console.log("currntUserId is ", currentUserId);

    if (!currentUserId) {
      return res.json({
        success: false,
        message: "currentUserIs is undifiend",
      });
    }

    const isUserExist = await User.findById(userId);
    // console.log("isuserExist is ", isUserExist);

    if (!isUserExist) {
      return res.json({
        success: false,
        message: "target user not found",
      });
    }

    const currentUser = await User.findById(currentUserId, {}, { new: true });

    if (!currentUser) {
      return res.json({
        success: false,
        message: "current user not found",
      });
    }

    if (!isUserExist.followers.includes(currentUser?._id)) {
      return res.json({
        success: false,
        message: "you are not following the user how can you unfollowe it",
      });
    }

    // remove the target user from following array of currentuser
    const newcurrentUser = await User.findByIdAndUpdate(
      currentUserId,
      {
        $pull: {
          following: userId,
        },
      },
      { new: true }
    )
      .populate("posts")
      .populate("saved")
      .populate("profile")
      .populate("followers")
      .populate("following")
      .populate("userStories")

      .exec();

    // console.log("newcurrent user is ", newcurrentUser);

    if (!currentUser) {
      return res.json({
        success: false,
        message: "current user is null unfollow nahi ho saka",
      });
    }

    // remove the currentuserId from followers array in targetarray
    const targetUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          followers: currentUserId,
        },
      },
      { new: true }
    );

    // console.log("targetuser is ", targetUser);

    if (!targetUser) {
      return res.json({
        success: false,
        message: "target  user is null unfollow nahi ho saka",
      });
    }

    // return success response
    return res.status(200).json({
      success: true,
      message: "Unfollower the user successfully",
      userdata: newcurrentUser,
    });
  } catch (error) {
    // console.log("could not unfollowe the user");
    return res.status(400).json({
      success: false,
      message: "could not unfollowe the target user",
    });
  }
};

export const getuserFulldata = async (
  req: Request,
  res: Response
): Promise<any> => {
  // console.log("req.body is ", req.body);

  try {
    const { email } = req.body;
    // console.log("email is", email);

    if (!email) {
      return res.json({
        success: false,
        message: "Email is required",
      });
    }
    // Fetching all user data from the database
    const newuserdata = await User.findOne({ email: email }, {}, { new: true })
      .populate("posts")
      .populate("saved")
      .populate("profile")
      .populate("followers")
      .populate("following")
      .populate("userStories")

      .exec();

    // console.log("data in getuserdata is ", newuserdata);
    if (!newuserdata) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      userdata: newuserdata,
    });
  } catch (error: unknown) {
    console.error("Error while fetching user data:", error);

    // Handle known error types
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }

    // For unknown error types
    return res.status(500).json({
      success: false,
      message: "Unknown error occurred",
    });
  }
};

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { searchTerm } = req.body;

    // console.log("searchTerm is ", req.body);
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }
    const users = await User.find(
      {
        username: { $regex: searchTerm, $options: "i" }, // Case-insensitive search
      },
      {},
      { new: true }
    )
      .populate({
        path: "posts",
        populate: {
          path: "comment",

          populate: {
            path: "user",
          },
        },
      })
      .populate("saved")
      .populate("profile")
      .populate("followers")
      .populate("following")
      .exec();

    // console.log("users are ", users);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    // console.log("could not search the user ", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while searching users",
      error,
    });
  }
};

export const fetchUserFeed = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const userId = authenticatedReq.user.id;
    // console.log("userId ", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Find the authenticated user and populate the following users and their posts
    const user = await User.findById(userId)
      .populate({
        path: "following", // Populate the following users
        populate: [
          {
            path: "posts", // Populate posts for each following user
            populate: [
              {
                path: "user", // Populate user details for each post
                select: "username profilePic _id userStories", // Specify fields to return for post user
              },
              {
                path: "comment", // Populate comments for each post
                populate: {
                  path: "user", // Populate user details for each comment
                  select: "username profilePic _id userStories", // Specify fields to return for comment user
                },
              },
            ],
          },
          {
            path: "userStories", // Populate userStories for each following user
            select: "_id content createdAt", // Specify fields to return for userStories
          },
        ],
      })
      .exec();

    // console.log("User data is ", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Could not fetch the user feed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User feed fetched successfully",
      userFeed: user.following, // Send the following users data
    });
  } catch (error) {
    // console.log("Could not fetch the user feed", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch the user feed",
    });
  }
};

export const fetchUserFollowingList = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    // fetch the token and userId
    const user = req.user;
    const userId = new mongoose.Types.ObjectId(user.id);
    // validate it
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User is not authenticated",
      });
    }
    // check if user exists based on userId
    const isUserExist = await User.findById(userId);
    if (!isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    //  fetch all following user
    // console.log("userid is ", userId);
    const userFollowingList = await User.findById(userId, {}, { new: true })
      .populate("following")
      .exec();

    // return success response
    return res.status(200).json({
      success: true,
      message: "Following list fetched successfully",
      followingList: userFollowingList?.following,
    });
  } catch (error) {
    // console.log("could not fetch the following list", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch the following list",
    });
  }
};

export const searchUserInMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { searchTerm } = req.body;

    // console.log("searchTerm is ", req.body);
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }
    const users = await User.find(
      {
        username: { $regex: searchTerm, $options: "i" }, // Case-insensitive search
      },
      {},
      { new: true }
    );

    // if (users.length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Could not fetch the user in message",
    //   });
    // }

    // if (!users) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Could not fetch the user in message",
    //   });
    // }
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    // console.log("could not featch the user in message", error);
    return res.status(500).json({
      success: false,
      message: "Could not featch the user in message",
    });
  }
};

export const featchUserData = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.body;
    // console.log("userId is ", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const userdata = await User.findById(userId, {}, { new: true })
      .populate({
        path: "posts",
        populate: {
          path: "comment",

          populate: {
            path: "user",
          },
        },
      })
      .populate("saved")
      .populate("profile")
      .populate("followers")
      .populate("following")
      .populate("userStories")

      .exec();

    if (!userdata) {
      return res.status(400).json({
        success: false,
        message: "Could not fetch the user data",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      userdata,
    });
  } catch (error) {
    // console.log("could not fetch the user data", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch the user data",
    });
  }
};

export const chnageProfilePic = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const email = req.body.user.email;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }
    const profileImage = req.files?.profileImage;

    // Handle different types of `profileImage`
    const profileImagePath = Array.isArray(profileImage)
      ? profileImage[0]?.tempFilePath // Take the first file if it's an array
      : profileImage?.tempFilePath; // If it's a single file

    // console.log("profile image path is ", profileImagePath);
    // Find user by email
    const user = await User.findOne({ email: email }).populate("profile");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (profileImage && profileImagePath) {
      // console.log("bhai profile image ko update karna he profile ko");
      const imgres = await uploadInCloudinary({
        data: profileImagePath,
        folder: "profile",
      });

      if (!imgres) {
        return res.status(400).json({
          success: false,
          message: "Could not change the profile picture",
        });
      }
      const newUser = await User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            profilePic: imgres?.secure_url,
          },
        },
        { new: true }
      );
      // console.log("newuser is ", newUser);

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
      });
    }
  } catch (error) {
    // console.log("could not change the profile picture", error);
    return res.status(500).json({
      success: false,
      message: "Could not change the profile picture",
    });
  }
};
