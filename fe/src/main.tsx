import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";
import axios from "axios"; 
import { setUser } from "./redux/authSlice"; // Cần import action setUser để xoá thông tin người dùng

// BẬT TÍNH NĂNG GỬI KÈM COOKIE CHO MỌI REQUEST
axios.defaults.withCredentials = true;

// THÊM CẤU HÌNH INTERCEPTOR ĐỂ BẮT LỖI TỰ ĐỘNG
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // SỬA LẠI ĐIỀU KIỆN: Chỉ cần Backend trả về lỗi 401 là tiến hành đá ra ngoài
    if (error.response && error.response.status === 401) {
      const currentState = store.getState();
      
      // Kiểm tra nếu trong Redux đang lưu trạng thái đăng nhập
      if (currentState.auth.user) {
        // 1. Xoá user trong Redux
        store.dispatch(setUser(null));
        
        // 2. Hiện thông báo cho người dùng
        alert("Phiên đăng nhập đã hết hạn hoặc tài khoản được đăng nhập ở nơi khác. Vui lòng đăng nhập lại!"); 
        
        // 3. Đá về trang login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);