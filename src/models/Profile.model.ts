import mongoose from "mongoose";

const ProfileShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  fullname: {
    type: String,
  },
  Pronoun: {
    type: String,
  },
  password: {
    type: String,
    // required:true
  },
  profilePic: {
    type: String,
    // required:true
  },
});

export const Profile = mongoose.model("Profile", ProfileShema);
