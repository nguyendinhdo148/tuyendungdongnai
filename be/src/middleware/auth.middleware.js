import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let accessToken = req.cookies.accessToken;
    let decoded;
    let user;

    // 1. Nếu có accessToken, thử verify nó trước
    if (accessToken) {
      try {
        decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
      } catch (err) {
        // Hết hạn hoặc lỗi -> Xoá để chạy logic refresh bên dưới
        accessToken = null;
      }
    }

    // NẾU accessToken HỢP LỆ -> Lấy user ra kiểm tra version token
    if (accessToken && decoded) {
      user = await User.findById(decoded.userId);
      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        return res.status(401).json({
          message: "Tài khoản của bạn đã được đăng nhập ở thiết bị khác.",
          success: false,
          isSessionExpired: true 
        });
      }
    }

    // 2. Nếu không có accessToken (hoặc vừa bị phát hiện hết hạn)
    if (!accessToken) {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({
          message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
          success: false,
        });
      }

      // Tự verify refreshToken 
      user = await User.findOne({ refreshToken });
      if (!user || user.refreshTokenExpiry < Date.now()) {
        return res.status(401).json({ 
          message: "Refresh token không hợp lệ hoặc đã hết hạn",
          success: false 
        });
      }

      // Giải mã xem refreshToken có đúng version không (Tránh lấy token cũ refresh lại)
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
        if (decodedRefresh.tokenVersion !== user.tokenVersion) {
          return res.status(401).json({
            message: "Tài khoản của bạn đã được đăng nhập ở thiết bị khác.",
            success: false,
            isSessionExpired: true
          });
        }
      } catch (err) {
         return res.status(401).json({ 
          message: "Refresh token không hợp lệ hoặc đã hết hạn",
          success: false 
        });
      }

      // Ký lại accessToken mới
      accessToken = jwt.sign(
        { userId: user._id, tokenVersion: user.tokenVersion }, 
        process.env.SECRET_KEY, 
        { expiresIn: "15m" }
      );

      // Set lại cookie accessToken cho client với cấu hình Domain chuẩn
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none", 
        domain: process.env.NODE_ENV === "production" ? ".tuyendungdongnai.com" : undefined,
        path: "/",
        maxAge: 15 * 60 * 1000,
      });

      // Lấy thông tin decoded từ token mới
      decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    }

    // 3. Gắn id vào request và đi tiếp
    req.id = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export const isRecruiter = async (req, res, next) => {
  try {
    if (!req.id) {
      return res.status(401).json({
        message: "You are not authenticated",
        success: false,
      });
    }

    const user = await User.findById(req.id);
    if (user.role !== "recruiter") {
      return res.status(401).json({
        message: "You are not a recruiter",
        success: false,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.id) {
      return res.status(401).json({
        message: "You are not authenticated",
        success: false,
      });
    }

    const user = await User.findById(req.id);
    if (user.role !== "admin") {
      return res.status(401).json({
        message: "You are not a admin",
        success: false,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};