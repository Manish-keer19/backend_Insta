import mongoose, { Schema } from "mongoose";
import { User } from "./User.model";
import { Post } from "./Post.model";
const LikesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
});

export const Like = mongoose.model("Like", LikesSchema);
