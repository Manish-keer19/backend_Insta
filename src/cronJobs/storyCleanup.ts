import cron from "node-cron";
import { Story } from "../models/Story.model";
import { uploadInCloudinary } from "../utils/cloudinary.utils";
import { User } from "../models/User.model";
import { io } from "..";
import { fetchAllDetailsUser } from "../utils/fetchAllDetailsUser";

console.log("Cron job initialized");
// Schedule the cleanup job
cron.schedule("0 * * * *", async () => {
  // cron.schedule("*/1 * * * *", async () => {
  console.log("Running scheduled story cleanup...");

  const now = new Date();
  console.log("now is ", now);
  const expiryTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
  // const expiryTime = new Date(Date.now() - 1 * 60 * 1000);
  console.log("expiry time is ", expiryTime);
  let userdata: any;
  try {
    // Find documents where any story's createdAt is older than 24 hours
    const stories = await Story.find({
      "stories.createdAt": { $lte: expiryTime },
    });
    console.log("stories are ", stories);

    for (const storyDoc of stories) {
      // Identify expired stories in the document
      console.log("story doc is ", storyDoc);
      const expiredStories = storyDoc.stories.filter(
        (story: any) => new Date(story.createdAt) <= expiryTime
      );

      console.log("expired stories are ", expiredStories);
      // Delete expired media from Cloudinary
      for (const expiredStory of expiredStories) {
        // await cloudinary.v2.uploader.destroy(expiredStory.publicId);
        await uploadInCloudinary({
          publicId: expiredStory.publicId,
          isUpload: false,
          data: "",
          folder: "",
        });
      }

      // Remove expired stories from the array
      storyDoc.stories.pull(
        ...storyDoc.stories.filter(
          (story: any) => new Date(story.createdAt) <= expiryTime
        )
      );

      console.log("updated story doc is ", storyDoc);
      // Save the updated document or delete it if no stories are left
      if (storyDoc.stories.length > 0) {
        await storyDoc.save(); // Save if there are non-expired stories left
        const user = await User.findById(storyDoc.user);
        userdata = await fetchAllDetailsUser(user?.email);

        console.log("userdata is ", userdata);

        io.emit("deletedStory", userdata);
      } else {
        const user = await User.findOneAndUpdate(
          { userStories: storyDoc._id },
          {
            $set: {
              userStories: null,
            },
          }
        );
        await Story.findByIdAndDelete(storyDoc._id); // Delete the document if all stories expired

        userdata = await fetchAllDetailsUser(user?.email);
        console.log("userdata is ", userdata);
        io.emit("deletedStory", userdata);
      }

      // console.log(`Processed story document with ID: ${storyDoc._id}`);
    }
  } catch (error) {
    // console.error("Error during story cleanup:", error);
  }
});
