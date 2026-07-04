import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { API } from "@/utils/constant";
import { LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const ResetPassword = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleReset = async () => {
    setMessage("");
    setError("");
    setIsLoading(true);

    // Validate password strength
    if (!/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa và chữ thường");
      setIsLoading(false);
      return;
    }

    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API}/user/reset-password`, {
        token,
        password: password,
      });

      if (res.data.success) {
        setMessage("Đặt lại mật khẩu thành công!");
        setIsRedirecting(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.data.message || "Có lỗi xảy ra.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Lỗi kết nối server.");
      } else {
        setError("Lỗi kết nối server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <AnimatePresence>
        {isRedirecting ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mx-auto w-16 h-16 mb-6"
            >
              <LoaderCircle className="w-full h-full text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn sẽ được chuyển đến trang đăng nhập...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5 }}
                className="bg-green-500 h-2 rounded-full"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h1 className="text-3xl font-bold mb-3">
                  Vie<span className="text-[#f83002]">Jobs</span>
                </h1>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-100 p-3 rounded-full mb-4"
              >
                <ShieldCheck className="size-7 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800">
                Đặt lại mật khẩu
              </h2>
              <p className="text-gray-500 text-sm mt-1 text-center">
                Vui lòng nhập mật khẩu mới cho tài khoản của bạn
              </p>
            </div>

            {/* Password Input */}
            <div className="mb-5">
              <Label className="block mb-2 text-sm font-medium text-gray-700">
                Mật khẩu mới
              </Label>
              <motion.div whileHover={{ scale: 1.01 }}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockKeyhole className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </motion.div>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <Label className="block mb-2 text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </Label>
              <motion.div whileHover={{ scale: 1.01 }}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockKeyhole className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full cursor-pointer py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 shadow-md hover:shadow-lg"
                onClick={handleReset}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Xác nhận
                  </span>
                )}
              </Button>
            </motion.div>

            {/* Messages */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center border border-green-200">
                    {message}
                  </div>
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center border border-red-200">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResetPassword;
