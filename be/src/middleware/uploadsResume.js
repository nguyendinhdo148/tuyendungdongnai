// // be/src/middleware/uploadsResume.js
// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";
// import fs from "fs";

// // Lấy __dirname trong ES module
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Đảm bảo thư mục uploads tồn tại
// const uploadsPath = path.join(__dirname, "..", "uploads");
// if (!fs.existsSync(uploadsPath)) {
//   fs.mkdirSync(uploadsPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .jpg, .jpeg and .png format allowed"), false);
//   }
// };

// export const upload = multer({ storage, fileFilter });

import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory
// For company logo and business license
export const resumeUpload = multer({ storage }).fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
]);
