import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";

// Define the type for the function parameters
interface UploadInCloudinaryParams {
  data: string; // This could be a file path or a file buffer, depending on your usage
  folder: string;
  isUpload?: boolean; // Optional parameter for upload or delete
  publicId?: string | null; // Optional parameter for the public ID of the image to delete
  resourceType?: "image" | "video" | "raw";
}
    
export const uploadInCloudinary = async ({
  data,
  folder,
  isUpload = true,
  publicId =null,
  resourceType = "image",
  
}: UploadInCloudinaryParams): Promise<UploadApiResponse | void> => {
  // Configuration
  cloudinary.config({
    cloud_name: "manish19",
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  if (isUpload) {
    try {
      const options: UploadApiOptions = {
        folder: folder,
        quality: "auto",
        resource_type: "auto" as "auto" | "image" | "video" | "raw", // Type assertion here
      };
      return await cloudinary.uploader.upload(data, options);
    } catch (error) {
      console.log("Some error occurred during the file upload to Cloudinary");
      console.log("Error in Cloudinary is:", error);
      throw error; // Rethrow the error after logging
    }
  } else {
    try {
      if (!publicId) {
        throw new Error("Public ID is required for deletion");
      }
      return await cloudinary.uploader.destroy(publicId,{
        resource_type:resourceType
      });
    } catch (error) {
      console.log(
        "Some error occurred during the file deletion from Cloudinary"
      );
      console.log("Error in Cloudinary is:", (error as Error).message);
      throw error; // Rethrow the error after logging
    }
  }
};
