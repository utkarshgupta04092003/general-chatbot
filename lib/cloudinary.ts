import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(
  fileUri: string,
  publicId?: string,
  folder: string = "chatbot-logos",
) {
  try {
    const res = await cloudinary.uploader.upload(fileUri, {
      public_id: publicId,
      folder: `general-chatbot/${folder}`,
      resource_type: "auto",
    });
    return res.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}
