import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import aiRoute from "./routes/ai.route.js";
import saveJobRoute from "./routes/saveJob.route.js";
import resumeRoute from "./routes/resume.route.js";
import adminRoute from "./routes/admin.route.js";
import blogRoute from "./routes/blog.route.js";
import mbtiRoute from "./routes/mbti.route.js";
import miRoute from "./routes/mi.route.js";
import searchHistoryRoute from "./routes/searchHistory.route.js";
import notificationRoute from "./routes/notification.route.js";
import { startNotificationScheduler } from "./services/notificationService.js";

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 1. CHỈNH SỬA allowedOrigins: Thêm trực tiếp link Vercel vào để chắc chắn không bị chặn
const allowedOrigins = [
  "https://www.tuyendungdongnai.com", 
  "https://tuyendungdongnai.com",     
  "http://localhost:5173",            
  "https://tuyendungdongnai.vercel.app", // <-- Thêm domain này vào (không có dấu / ở cuối)
  process.env.URL_CLIENT              
].filter(Boolean); // Lọc bỏ giá trị undefined nếu URL_CLIENT không tồn tại

// 2. CHỈNH SỬA corsOptions: Thêm methods và allowedHeaders
const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép requests không có origin (ví dụ: mobile apps hoặc postman) và các origin trong mảng
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`)); // Báo lỗi rõ ràng hơn để dễ debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// 3. Xoá bớt 1 dòng bị lặp (chỉ giữ 1 dòng)
app.use(cors(corsOptions));


const PORT = process.env.PORT || 3000;

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/ai", aiRoute);
app.use("/api/v1/save-job", saveJobRoute);
app.use("/api/v1/resume", resumeRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/mbti", mbtiRoute);
app.use("/api/v1/mi", miRoute);
app.use("/api/v1/search-history", searchHistoryRoute);
app.use("/api/v1/notification", notificationRoute);

app.get('/', (req, res) => {
  res.json({
    status: "success",
    message: "Backend API is running successfully!"
  });
});

// error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
  // Khởi động notification scheduler
  startNotificationScheduler();
});