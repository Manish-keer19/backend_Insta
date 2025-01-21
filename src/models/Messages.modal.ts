import mongoose, { Schema } from "mongoose";

const MessageShema = new mongoose.Schema(
  {
    currentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    anotherUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        message: {
          type: String,
        },
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        media:{
          type:String,

        },
        mediaType:{
          type:String
        },
        publicId:{
          type:String
        }
      },
    ],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", MessageShema);
