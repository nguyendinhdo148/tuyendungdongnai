import { Router } from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  updateAvatar,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { singleUpload } from "../middleware/multer.js";

const router = Router();

router
  .post("/register", singleUpload, register)
  .post("/login", login)
  .post("/logout", isAuthenticated, logout)
  .post("/refresh-token", refreshToken);
router.put("/profile/update", isAuthenticated, singleUpload, updateProfile);
router.put("/profile/avatar", isAuthenticated, singleUpload, updateAvatar);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
