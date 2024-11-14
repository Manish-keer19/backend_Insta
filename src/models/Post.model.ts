import mongoose, { Schema } from "mongoose";

const PostShcema = new Schema({
  caption: String,
  image: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comment: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  saved: [{ type: Schema.Types.ObjectId, ref: "User" }],
  location: String,
  imagePublicId: String,
});

export const Post = mongoose.model("Post", PostShcema);
