import mongoose, { Schema } from "mongoose";

const userschema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  token: {
    type: String,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  profilePic: { type: String },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  // likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  // comment: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  saved: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  location: String,
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  userStories: { type: Schema.Types.ObjectId, ref: "Story" },
  // folowersStories: [{ type: Schema.Types.ObjectId, ref: "Story" }],
});

export const User = mongoose.model("User", userschema);
