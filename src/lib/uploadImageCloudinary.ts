import cloudinary from "./cloudinary";

export const DeleteCloudinaryImage = async (publicIds: any) => {
  try {
    if (!publicIds || publicIds.length === 0) return "Public IDs not provided";
    // Delete image assets
    const deleteImageResponse = await cloudinary.api.delete_resources(
      publicIds,
      {
        type: "upload",
        resource_type: "image",
      }
    );
    return { deleteImageResponse };
  } catch (error) {
    console.log("Error deleting from Cloudinary:", error);
    return null;
  }
};

export const UploadImage = async (file: File, folder: string) => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise(async (resolve, reject) => {
    await cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folder,
        },
        async (err, result) => {
          if (err) {
            reject(err.message);
          }
          resolve(result);
        }
      )
      .end(bytes);
  });
};
