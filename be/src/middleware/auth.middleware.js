import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let accessToken = req.cookies.accessToken;
    let decoded;

    // 1. Nếu có accessToken, thử verify nó trước
    if (accessToken) {
      try {
        decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
      } catch (err) {
        // Nếu token hết hạn (TokenExpiredError) hoặc lỗi, set accessToken = null 
        // để ép hệ thống chạy xuống bước kiểm tra Refresh Token bên dưới
        accessToken = null;
      }
    }

    // 2. Nếu không có accessToken (hoặc vừa bị phát hiện hết hạn ở trên)
    if (!accessToken) {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({
          message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
          success: false,
        });
      }

      // Tự verify và tạo accessToken mới
      const user = await User.findOne({ refreshToken });
      if (!user || user.refreshTokenExpiry < Date.now()) {
        return res.status(401).json({ 
          message: "Refresh token không hợp lệ hoặc đã hết hạn",
          success: false 
        });
      }

      // Ký lại accessToken mới
      accessToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: "15m",
      });

      // Set lại cookie accessToken cho client với cấu hình Domain chuẩn
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
  secure: true,
  sameSite: "none", // Sửa chữ "lax" thành "none"
  // Đã xóa hoàn toàn dòng domain ở đây
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