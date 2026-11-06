# Hướng dẫn cài đặt và cấu hình Tuyển dụng Đồng Nai

## Yêu cầu tiền điều kiện

1. Node.js phiên bản 18.0.0 trở lên
2. MongoDB đã được cài đặt
3. Git
4. VS Code (khuyến nghị)

## Cấu trúc dự án

```
Tuyển dụng Đồng Nai/
├── be/ # Backend source code
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/ # Custom middleware
│   │   ├── models/ # Database models
│   │   ├── routes/ # API routes
│   │   └── server.js # Server configuration
│   └── package.json
│
└── fe/ # Frontend source code
    ├── src/
    │   ├── components/ # Reusable components
    │   │   ├── ui/ # UI components
    │   │   ├── admin/ # Admin components
    │   │   └── recruiter/# Recruiter components
    │   ├── redux/ # State management
    │   ├── types/ # TypeScript types
    │   └── App.tsx # Root component
    └── package.json
```

## Bước 1: Clone dự án

```bash
git clone <repository-url>
cd Tuyển dụng Đồng Nai
```

## Bước 2: Cài đặt Backend

1. Di chuyển vào thư mục backend:

```bash
cd be
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` trong thư mục `be` với nội dung:

```env
MONGO_URI=
PORT=8000
SECRET_KEY=
REFRESH_SECRET_KEY=
EMAIL_USER=
EMAIL_PASSWORD=
FRONTEND_URL=
API_SECRET=
API_KEY=
CLOUD_NAME=
OPENAI_API_KEY=
```

4. Khởi động server phát triển:

```bash
npm run dev
```

## Bước 3: Cài đặt Frontend

1. Mở terminal mới, di chuyển vào thư mục frontend:

```bash
cd fe
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Khởi động ứng dụng:

```bash
npm run dev
```

## Bước 4: Cấu hình Database

1. Đảm bảo MongoDB đang chạy
2. Database sẽ tự động được tạo khi khởi động backend
3. Dữ liệu mẫu sẽ được seed tự động

## Bước 5: Truy cập ứng dụng

- http://localhost:5173

## Sitemap tự cập nhật

- Backend phục vụ sitemap động tại `/sitemap.xml`, gồm các trang công khai và công việc, công ty, bài viết đã được duyệt.
- Frontend Vercel chuyển tiếp `https://www.tuyendungdongnai.com/sitemap.xml` tới backend bằng Vercel Function. Cần cấu hình biến môi trường `VITE_API_URL` trong Vercel trỏ tới backend production (ví dụ `https://<backend-host>/api/v1`).
- Sau khi deploy, gửi `https://www.tuyendungdongnai.com/sitemap.xml` trong Google Search Console. Dữ liệu sitemap được làm mới theo cache tối đa một giờ.
