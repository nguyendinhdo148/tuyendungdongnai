import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const clearAuthCookies = (res) => {
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
};

export const isAuthenticated = async (req, res, next) => {
  try {
    let accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    const sendUnauthorized = (message = "You are not authenticated") => {
      clearAuthCookies(res);
      return res.status(401).json({ message, success: false });
    };

    const generateAccessFromRefresh = async () => {
      if (!refreshToken) return null;

      const user = await User.findOne({ refreshToken });
      if (!user || user.refreshTokenExpiry < Date.now()) {
        return null;
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
        if (decodedRefresh.userId.toString() !== user._id.toString()) {
          return null;
        }
      } catch (err) {
        return null;
      }

      const newAccessToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: "15m",
      });

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 15 * 60 * 1000,
      });

      return newAccessToken;
    };

    if (!accessToken) {
      accessToken = await generateAccessFromRefresh();
      if (!accessToken) return sendUnauthorized("Invalid refresh token");
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
      req.id = decoded.userId;
      return next();
    } catch (err) {
      accessToken = await generateAccessFromRefresh();
      if (!accessToken) return sendUnauthorized("Invalid or expired access token");

      const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
      req.id = decoded.userId;
      return next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed", success: false });
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
