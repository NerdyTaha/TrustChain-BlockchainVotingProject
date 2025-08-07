import { cloudinary } from "@/middlewares/cloudinary.config";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

const cloudinaryUpload = async (
  fileStream: Buffer,
  folder: string,
  filename: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          folder: folder,
          public_id: filename,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(
              new Error("Unknown error occurred during Cloudinary upload")
            );
          }
        }
      )
      .end(fileStream);
  });
};

export { cloudinaryUpload };
