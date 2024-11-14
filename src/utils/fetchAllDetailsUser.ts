import { User } from "../models/User.model";
import path from "path";

export const fetchAllDetailsUser = async (email: any, id?: string) => {
  return await User.findOne({ email: email }, {}, { new: true })
    .populate({
      path: "posts",
      populate: [
        {
          path: "user",
          select: "username profilePic _id userStories",
        },
        {
          path: "comment",
          populate: {
            path: "user",
            select: "username profilePic _id userStories",
          },
        },
      ],
    })
    .populate("saved")
    .populate("profile")
    .populate("followers")
    .populate("following")

    .exec();
};
