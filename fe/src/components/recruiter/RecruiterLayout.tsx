import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  BriefcaseIcon,
  Users,
  LogOut,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import toast from "react-hot-toast";
import { API } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const RecruiterLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store: RootState) => store.auth);

  // Mặc định là false để không vướng víu trên mobile lúc mới vào
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/recruiter",
      icon: LayoutDashboard,
    },
    {
      name: "Quản lý công ty",
      href: "/recruiter/company",
      icon: Building2,
    },
    {
      name: "Quản lý việc làm",
      href: "/recruiter/jobs",
      icon: BriefcaseIcon,
    },
    {
      name: "Quản lý ứng viên",
      href: "/recruiter/candidates",
      icon: Users,
    },
  ];

  // protect route recruiter
  useEffect(() => {
    if (!user || user.role !== "recruiter") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      // Cứ gọi API logout lên backend, được thì tốt, báo lỗi cũng không sao
      const res = await axios.post(
        `${API}/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Đăng xuất thành công!");
      }
    } catch (error) {
      console.log("Backend báo lỗi token, nhưng cứ ép đăng xuất ở frontend");
      // Có thể tùy chọn hiện toast báo đăng xuất (bạn có thể bỏ nếu không muốn)
      toast.success("Đăng xuất thành công!");
    } finally {
      // Đưa đoạn này vào finally để DÙ THÀNH CÔNG HAY THẤT BẠI đều clear user
      dispatch(setUser(null));
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* --- Mobile Top Header --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-md hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-semibold text-gray-800 text-lg">
            Nhà Tuyển Dụng
          </span>
        </div>
        <Avatar className="h-8 w-8 shadow-sm">
          <AvatarImage src={user?.profile?.profilePhoto?.url} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
            {user?.fullname?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* --- Backdrop (Lớp mờ khi mở menu trên mobile) --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Sidebar --- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r shadow-xl lg:shadow-sm border-gray-200 transition-transform duration-300 ease-in-out transform flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:w-64" // Luôn hiện và set width chuẩn trên Desktop
        )}
      >
        {/* Profile section */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              <AvatarImage src={user?.profile?.profilePhoto?.url} />
              <AvatarFallback className="bg-blue-600 text-white font-medium">
                {user?.fullname?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-gray-900 truncate">
                {user?.fullname}
              </h2>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
            Quản lý
          </div>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)} // Tự đóng menu khi bấm trên mobile
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive ? "text-blue-700" : "text-gray-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center cursor-pointer w-full gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* --- Main content --- */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64 transition-all duration-300 w-full">
        {/* pt-16 để đẩy content xuống không bị lấp bởi Mobile Header, lg:pt-0 để bỏ trên desktop */}
        <main className="flex-1 p-4 pt-20 lg:pt-8 lg:p-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;