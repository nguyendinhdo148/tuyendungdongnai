import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (fileBuffer, options = {}) => {
  const retryCount = Number(process.env.CLOUDINARY_RETRY_COUNT || 2);
  const timeoutMs = Number(process.env.CLOUDINARY_TIMEOUT_MS || 60000);

  for (let attempt = 1; attempt <= retryCount; attempt += 1) {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            timeout: timeoutMs,
            ...options,
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        );

        uploadStream.on("error", reject);
        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      const isLastAttempt = attempt === retryCount;
      if (isLastAttempt) {
        throw error;
      }
      console.warn(
        `Cloudinary upload attempt ${attempt} failed, retrying...`,
        error.message
      );
    }
  }
};

export default cloudinary;
