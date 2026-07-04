import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory
export const singleUpload = multer({ storage }).single("file"); // Use 'file' as the field name for the file input in the form

// For company logo and business license
export const companyUpload = multer({ storage }).fields([
  { name: "logo", maxCount: 1 },
  { name: "businessLicense", maxCount: 1 },
]);
