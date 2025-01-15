
import { Request, Response } from "express";
import { Story } from "../models/Story.model";
import { User } from "../models/User.model";
import { uploadInCloudinary } from "../utils/cloudinary.utils";
import { UploadedFile } from "express-fileupload"; // Ensure this import if using express-fileupload
import { fetchAllDetailsUser } from "../utils/fetchAllDetailsUser";
import mongoose, { Mongoose } from "mongoose";
import { populate } from "dotenv";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const createStory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const media = req.files?.media;
    // console.log("media is ", media);
    if (!media) {
      return res.status(400).json({
        success: false,
        message: "Media is required",
      });
    }

    const { token } = req.body;
    const userId = req.user.id;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is missing. All fields are required",
      });
    }

    const isUserExist = await User.findById(userId);
    if (!isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    // console.log("is user exist is ", isUserExist);

    const mediaFile = Array.isArray(media) ? media[0] : media;
    console.log("mediaFile is ", mediaFile);

    const mediaType = mediaFile.mimetype;
    console.log("mimetype is ", mediaType);
    let mediaCategory: "image" | "video" | null = null;

    if (mediaType.startsWith("image/")) {
      mediaCategory = "image";
    } else if (mediaType.startsWith("video/")) {
      mediaCategory = "video";
    }
    console.log("media category is ", mediaCategory);

    if (!mediaCategory) {
      return res.status(400).json({
        success: false,
        message: "Unsupported media type. Only images and videos are allowed.",
      });
    }

    const newMedia = await uploadInCloudinary({
      data: mediaFile.tempFilePath,
      folder: "stories",
    });

    if (!newMedia) {
      return res.status(400).json({
        success: false,
        message: "Could not create the story new media is null",
      });
    }
    // Check if a story document already exists for this user
    let userStory = await Story.findOne({ user: userId });

    const newStoryContent = {
      content: newMedia?.secure_url,
      mediaType: mediaCategory,
      createdAt: Date.now(),
      publicId: newMedia?.public_id,
    };

    if (userStory) {
      // If a story document exists, push the new story content to the stories array
      const updatedStory = await Story.findOneAndUpdate(
        { user: userId },
        { $push: { stories: newStoryContent } },
        { new: true }
      );

      if (!updatedStory) {
        return res.status(400).json({
          success: false,
          message: "Could not create the story update story i",
        });
      }
    } else {
      userStory = await Story.create({
        user: userId,
        stories: [newStoryContent],
      });

      if (!userStory) {
        return res.status(400).json({
          success: false,
          message: "Could not create the story userstory is null",
        });
      }

      //  add story data in userssotry usermodel userstories collection
      const newUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            userStories: userStory._id,
          },
        },
        { new: true }
      );
      // console.log("added userd story in user", newUser);

      // Find all followers of the user and update their stories
      //   const user = await User.findById(userId).populate("followers");
      //   if (user && user.followers) {
      //     await Promise.all(
      //       user.followers.map(async (follower: any) => {
      //         await User.findByIdAndUpdate(
      //           follower._id,
      //           { $push: { folowersStories: userStory?._id } },
      //           { new: true }
      //         );
      //       })
      //     );
      //   }
    }

    const userdata = await fetchAllDetailsUser(req.user.email);

    return res.status(201).json({
      success: true,
      message: "Story created successfully",
      story: userStory,
      userdata,
    });
  } catch (error) {
    // console.log("Could not create the story", error);
    return res.status(500).json({
      success: false,
      message: "Could not create the story",
    });
  }
};

export const getStory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    // console.log("id is ", id);
    // const userId = id.split("_")[0];
    const story = await Story.findOne({ user: id }, {}, { new: true })
      .populate({
        path: "stories", // Populate stories array
        populate: {
          path: "watchedBy", // Populate the user field inside each story
          select: "username email _id profilePic userStories", // Specify which fields you want from the user document
        },
      })
      .exec();
    // console.log("story is ", story);
    if (!story || story.stories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Story not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Story found successfully",
      story,
    });
  } catch (error) {
    // console.log("Could not get the story", error);
    return res.status(500).json({
      success: false,
      message: "Could not get the story",
    });
  }
};

export const deleteStory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  // fetch the story id from req.body
  // validate it
  // check if story exists
  // delete the story
  // delete the story from cloudinary
  // delete the story from userstories
  // return success response
  try {
    // fetch the story id from req.body
    const { storyDocId, storyId } = req.body;
    const userId = req.user.id;
    // validate it
    // console.log("story Id", storyId);
    // console.log("storyDocId", storyDocId);
    if (!storyId) {
      return res.status(400).json({
        success: false,
        message: "story id is required",
      });
    }

    // check if story exists
    const isStoryExist = await Story.findById(storyDocId);
    // console.log("isStoryExist is ", isStoryExist);
    if (!isStoryExist) {
      return res.status(400).json({
        success: false,
        message: "story could not found",
      });
    }

    if (!isStoryExist.stories.find((story: any) => story._id.equals(storyId))) {
      return res.status(400).json({
        success: false,
        message: "story does not exist",
      });
    }

    const publicId = isStoryExist?.stories.find((story: any) =>
      story._id.equals(storyId)
    )?.publicId;

    // console.log("public id is ", publicId);
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "public id not found",
      });
    }

    const currentStory = isStoryExist.stories.filter((story: any) =>
      story._id.equals(storyId)
    );
    // console.log("cureentstory", currentStory);

    const mediaType = currentStory[0].mediaType;

    // delete the story from cloudinary
    const cloudinaryDeleteImgRes = await uploadInCloudinary({
      data: "",
      folder: "",
      isUpload: false,
      publicId: publicId,
      resourceType: mediaType,
    });
    // console.log("cloudinarydeleteImgRes is ", cloudinaryDeleteImgRes);
    if (!cloudinaryDeleteImgRes) {
      return res.status(400).json({
        success: false,
        message: "could not delete the story from cloudinary",
      });
    }

    if (cloudinaryDeleteImgRes?.result !== "ok") {
      return res.status(400).json({
        success: false,
        message: "could not delete the story from cloudinary",
      });
    }

    let deletedStory: any;
    // delete the story
    if (isStoryExist.stories.length == 1) {
      // console.log("now we are going to delete the story Document");
      deletedStory = await Story.findByIdAndDelete(isStoryExist._id);

      // delete the story from userstories
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $unset: { userStories: "" }, // Removes the userStories field entirely if it's the last story
        },
        { new: true }
      );

      // console.log("deleted story ", deletedStory);
      // console.log("updated story ", updatedUser);
    } else {
      deletedStory = await Story.findByIdAndUpdate(
        isStoryExist._id,
        {
          $pull: {
            stories: { _id: storyId },
          },
        },
        { new: true }
      );

      // console.log("deleted story is ", deletedStory);
    }

    const userdata = await fetchAllDetailsUser(req.user.email);
    // return success response
    return res.status(200).json({
      success: true,
      message: "story has been deleted succefully",
      userdata,
    });
  } catch (error) {
    // console.log("could not delete the story", error);
    return res.status(500).json({
      success: false,
      message: "could not delete the story",
    });
  }
};

export const adduserToStory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // console.log("hume user ko story me add karna h");
    // featch the story id from req.body
    const { storyDocId, storyId } = req.body;
    const userId = req.user.id;
    // validate it
    // console.log("story Id", storyId);
    // console.log("storyDocId", storyDocId);
    if (!storyId || !storyDocId) {
      return res.status(400).json({
        success: false,
        message: "story id is required",
      });
    }

    // check if story exists
    const isStoryExist = await Story.findById(storyDocId);
    // console.log("isStoryExist is ", isStoryExist);
    if (!isStoryExist) {
      return res.status(400).json({
        success: false,
        message: "story could not found",
      });
    }

    // Check if the user has already watched the story
    const alreadyWatched = await Story.findOne({
      _id: storyDocId,
      stories: {
        $elemMatch: {
          _id: storyId,
          watchedBy: userId,
        },
      },
    });
    console.log("alreadyWatched is ", alreadyWatched);

    if (alreadyWatched) {
      return res.status(200).json({
        success: false,
        message: "User has already watched this story",
      });
    }
    // update the story document
    const updatedStory = await Story.findOneAndUpdate(
      { _id: storyDocId, "stories._id": storyId },
      { $addToSet: { "stories.$.watchedBy": userId } },
      { new: true }
    );
    if (!updatedStory) {
      return res.status(400).json({
        success: false,
        message: "story could not found",
      });
    }
    // console.log("user has been watched the story succesfully");
    return res.status(200).json({
      success: true,
      message: "story has been watched by user",
      updatedStory,
    });
  } catch (error) {
    // console.log("could not watched by user", error);
    return res.status(500).json({
      success: false,
      message: "could not watched by user",
    });
  }
};

export const getFolllowersStories = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    //  get userId from req.user
    const userId = req.user.id;
    // get user following detail only stories
    const stories = await User.findById(userId)
      .select("following")
      .populate({
        path: "following",
        select: "userStories",
        populate: {
          path: "userStories",
          select:"user",
          populate: {
            path: "user",
            select: "username profilePic _id userStories",
          },
          
        },
      })
      .exec();

    if (!stories) {
      return res.status(400).json({
        success: false,
        message: "could not get the story of followers",
      });
    }
    // console.log("user's following stories are ", stories);

    const filteredStories = stories.following.filter(
      (user: any) => user.userStories
    );

    // console.log("filtered stories are ", filteredStories);
    return res.status(200).json({
      success: true,
      message: "users following stories found successfully",
      stories: filteredStories,
      // stories1:stories
    });
  } catch (error) {
    // console.log("could not get the story of followers", error);
    return res.status(500).json({
      success: false,
      message: "could not get the story of followers",
    });
  }
};
