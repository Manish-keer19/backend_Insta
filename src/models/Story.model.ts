import mongoose, { Schema } from "mongoose";

const StorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stories: [
    {  
      content: {
        type: String, // URL or path of the media (image or video)
        required: true,
      },
      mediaType: {
        type: String, // "image" or "video"
        enum: ["image", "video"],
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      publicId: {
        type: String,
        required: true,
      },

      watchedBy: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  ],
});

// Create the Story model
export const Story = mongoose.model("Story", StorySchema);
