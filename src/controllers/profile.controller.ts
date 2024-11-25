import { Request, Response } from "express";
import { Profile } from "../models/Profile.model";
import { User } from "../models/User.model";
import { uploadInCloudinary } from "../utils/cloudinary.utils";

export const editProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  // console.log("edit profile function called");
  try {
    // Extract data from request body
    const { name, username, bio, pronoun, email } = req.body;

    // console.log("name is ", name);
    // console.log("username is ", username);
    // console.log("email is ", email);
    // console.log("bio is ", bio);
    // console.log("pronoun is ", pronoun);

    const profileImage = req.files?.profileImage;

    // Handle different types of `profileImage`
    const profileImagePath = Array.isArray(profileImage)
      ? profileImage[0]?.tempFilePath // Take the first file if it's an array
      : profileImage?.tempFilePath; // If it's a single file

    // console.log("profile image path is ", profileImagePath);

    // // Validate the incoming data
    // if (!email || !name || !username || !bio || !pronoun) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields are required",
    //   });
    // }

    // Find user by email
    const user = await User.findOne({ email }).populate("profile");

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
          message: "Error uploading profile image",
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

    
    }  if (user.profile) {
      // console.log("bhai update karna he profile ko");
      // Profile exists, update the profile
      const updatedProfile = await Profile.findOneAndUpdate(
        { _id: user.profile }, // Match the profile by its ID
        { name, username, bio, pronoun }, // Update the profile fields
        { new: true } // Return the updated document
      );

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } else {
      // console.log("bhai create karna he profile ko");
      // No profile exists, create a new one
      const newProfile = await Profile.create({
        name,
        username,
        bio,
        pronoun,
        email: user.email, // Optional: Attach email to the profile if needed
      });

      // Update the user to reference the new profile
      user.profile = newProfile._id;
      await user.save(); // Save the updated user with the new profile reference

      return res.status(201).json({
        success: true,
        message: "Profile created successfully",
        data: newProfile,
      });
    }
  } catch (error) {
    console.error("Error in editProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update profile",
    });
  }
};
