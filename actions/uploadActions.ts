"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export async function uploadPhoto(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "nextjs_blog_images" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const data = result as any;
    return {
      id: data.public_id,
      url: data.secure_url,
    };
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

export async function deletePhoto(public_id: string) {
  try {
    return await cloudinary.uploader.destroy(public_id);
  } catch (error: any) {
    console.log(error);
    return { errMessage: error.message };
  }
}

export async function deleteManyPhotos(publicIdsToDelete: string[]) {
  try {
    const deleteResponses = await Promise.all(
      publicIdsToDelete.map(async (public_id) => {
        try {
          const result = await cloudinary.uploader.destroy(public_id);
          return { public_id, result };
        } catch (error: any) {
          console.log(error);
          return { errMessage: error.message };
        }
      })
    );

    return deleteResponses;
  } catch (error: any) {
    console.log(error);
    return { errMessage: error.message };
  }
}

