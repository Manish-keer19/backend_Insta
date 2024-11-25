import { Comment } from "../models/comment.model";
import { Post } from "../models/Post.model";
import { User } from "../models/User.model";
import { uploadInCloudinary } from "../utils/cloudinary.utils";
import { fetchAllDetailsUser } from "../utils/fetchAllDetailsUser";

export const createPost = async (req: any, res: any) => {
  // fetch the caption ,image and location
  // validate it
  // put the image in cloudinary
  //  creaete post entry in db
  // return post

  try {
    // fetch the caption ,image and location
    const { caption, location } = req.body;
    // console.log("caption is ", caption);
    // console.log("location is ", location);
    // console.log("req.files is ", req.files);
    const image = req.files.image ? req.files.image : null;
    // console.log("image is ", image);
    // validate it
    if (!caption || !location || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // console.log("image is ", image);

    let mediaType;

    image.mimetype.startsWith("image/")
      ? (mediaType = "image")
      : (mediaType = "video");

      console.log("media type is ", mediaType);
    // return res.status(200).json({
    //   success: true,
    //   message: "just for testing this create post has been stoped",
    // });

    // put the image in cloudinary
    const imgres = await uploadInCloudinary({
      data: image.tempFilePath,
      folder: "posts",
    });
    // console.log("image res is ", imgres);
    //  creaete post entry in db
    if (!imgres) {
      return res.status(400).json({
        success: false,
        message: "Image could not be uploaded",
      });
    }
    const newPost = await Post.create({
      caption: caption,
      image: imgres?.secure_url,
      location: location,
      user: req.user.id,
      imagePublicId: imgres?.public_id,
      mediaType: mediaType,
    });

    // add post id to user
    const newUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { posts: newPost._id },
      },
      { new: true }
    );
    // console.log("new user is ", newUser);

    const userdata = await fetchAllDetailsUser(req?.user?.email);
    // console.log("userdata is ", userdata);

    // return res
    return res.status(200).json({
      success: true,
      message: "Post created successfully",
      userdata,
    });
  } catch (error) {
    // console.log("could not create post", error);
    return res.status(500).json({
      success: false,
      message: "could not create post",
    });
  }
};

export const deletePost = async (req: any, res: any) => {
  // fetch the post id from req.body
  // validate it
  // check karo post exist or not
  // delete the post
  // remove that postid from user
  // return success response
  try {
    // fetch the post id from req.body
    const { postId } = req.body;
    // console.log("PostId is ", postId);
    // validate it
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "PostId is required",
      });
    }

    // check karo post exist or not

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    // delete the image from cloudinary
    const deletedImg = await uploadInCloudinary({
      data: "",
      folder: "",
      isUpload: false,
      publicId: post?.imagePublicId,
      resourceType: post.mediaType,
    });

    // console.log("deleted img is ", deletedImg);

    if (!deletedImg) {
      return res.status(400).json({
        success: false,
        message: "could not delete the post from cloudinary",
      });
    }

    if (deletedImg?.result !== "ok") {
      return res.status(400).json({
        success: false,
        message: "could not delete the Post from cloudinary",
      });
    }

    // delete the post
    const deletedPost = await Post.findByIdAndDelete(postId, { new: true });
    if (!deletedPost) {
      return res.status(400).json({
        success: false,
        message: "Post delete nahi ho saki ",
      });
    }

    // console.log("deletedPost is ", deletedPost);
    // delete all comment of that post
    // console.log("all the comments of this post are deleting");
    const deletedComment = await Comment.deleteMany({ post: postId });
    // console.log("deletedComment is ", deletedComment);

    // remove that postid from user
    const user = await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        posts: postId,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const userdata = await fetchAllDetailsUser(user.email);
    // return success response

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      deletedPost: deletedPost,
      userdata,
    });
  } catch (error) {
    console.error("could not delete post", error);
    return res.status(500).json({
      success: false,
      message: "could not delete post",
    });
  }
};


// const updatePostsWithTimestamps = async () => {
// //   try {
// //     // Update all posts without createdAt or updatedAt
// //     await Post.updateMany(
// //       { createdAt: { $exists: false } }, // Posts without createdAt field
// //       { $set: { createdAt: new Date(), updatedAt: new Date() } } // Set both createdAt and updatedAt
// //     );
//     console.log("Timestamps added successfully!");
// //   } catch (error) {
// //     console.error("Error adding timestamps:", error);
// //   }
// // };

// // // Call the function to update posts
// // updatePostsWithTimestamps();

// const updatePosts = async () => {
//   try {
//     // Update all posts that don't have a mediaType field
//     await Post.updateMany(
//       { mediaType: { $exists: false } }, // Only update posts without a mediaType field
//       { $set: { mediaType: 'image' } }   // Set the mediaType to 'image'
//     );
    console.log("Posts updated successfully!");
//   } catch (error) {
//     console.error("Error updating posts:", error);
//   }
// };

// // Call the function to update posts
// updatePosts();

