import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users2,
  BriefcaseIcon,
  ChevronRight,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Minus,
  UserCheck,
} from "lucide-react";
import { API } from "@/utils/constant";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardSkeleton from "../components/Skeleton/DashboardSkeleton";
import type { Application } from "@/types/application";
import type { Job } from "@/types/job";

const Recruiter = () => {
  const { user } = useSelector((store: RootState) => store.auth);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState<{
    todayApplications: number;
    activeJobs: number;
    pendingApplications: number;
    upcomingInterviews: number;
    recentApplications: Application[];
    popularJobs: Job[];
    yesterdayApplications: number;
    yesterdayActiveJobs: number;
    yesterdayPendingApplications: number;
    yesterdayUpcomingInterviews: number;
  }>({
    todayApplications: 0,
    activeJobs: 0,
    pendingApplications: 0,
    upcomingInterviews: 0,
    recentApplications: [],
    popularJobs: [],
    yesterdayApplications: 0,
    yesterdayActiveJobs: 0,
    yesterdayPendingApplications: 0,
    yesterdayUpcomingInterviews: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${API}/application/overview`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getPercentChange = (today: number, yesterday: number) => {
    if (yesterday === 0) return today === 0 ? "0%" : "+100%";
    const change = ((today - yesterday) / yesterday) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const getStatusBadge = (status: Application["status"]) => {
    const config = {
      pending: {
        label: "Chờ xem xét",
        className: "bg-yellow-100 text-yellow-800",
      },
      reviewing: {
        label: "Đang xem",
        className: "bg-blue-100 text-blue-800",
      },
      accepted: {
        label: "Đã nhận",
        className: "bg-green-100 text-green-800",
      },
      rejected: { label: "Từ chối", className: "bg-red-100 text-red-800" },
    }[status];
    return <Badge className={`${config.className} whitespace-nowrap`}>{config.label}</Badge>;
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-4 md:space-y-8 pb-10">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-violet-500 to-indigo-600 rounded-xl md:rounded-2xl p-5 md:p-8 shadow-lg text-white">
        <h1 className="text-xl md:text-3xl font-bold">👋 Xin chào, {user?.fullname}</h1>
        <p className="mt-1 md:mt-2 text-sm md:text-base text-indigo-100 font-medium">
          Chào mừng bạn quay trở lại với trang quản lý tuyển dụng
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatsCard
          icon={<Users2 className="w-6 h-6 md:w-8 md:h-8 text-white" />}
          iconBg="bg-gradient-to-br from-indigo-500 to-purple-600"
          label="Ứng viên mới"
          value={dashboardData.todayApplications}
          badge="Hôm nay"
          trend={getPercentChange(
            dashboardData.todayApplications,
            dashboardData.yesterdayApplications
          )}
        />
        <StatsCard
          icon={<BriefcaseIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />}
          iconBg="bg-gradient-to-br from-green-500 to-emerald-600"
          label="Vị trí đang tuyển"
          value={dashboardData.activeJobs}
          badge="Đang mở"
          trend={getPercentChange(
            dashboardData.activeJobs,
            dashboardData.yesterdayActiveJobs
          )}
        />
        <StatsCard
          icon={<UserCheck className="w-6 h-6 md:w-8 md:h-8 text-white" />}
          iconBg="bg-gradient-to-br from-amber-400 to-amber-600"
          label="Đang chờ duyệt"
          value={dashboardData.pendingApplications}
          badge="Cần xem xét"
          trend={getPercentChange(
            dashboardData.pendingApplications,
            dashboardData.yesterdayPendingApplications
          )}
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Applications */}
        <Card className="lg:col-span-2 rounded-xl border-none shadow-lg overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-gray-50 to-slate-100 p-4 md:p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  Ứng viên gần đây
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {dashboardData.recentApplications.length} ứng viên mới
                </p>
              </div>
              <Badge
                variant="outline"
                className="cursor-pointer border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors whitespace-nowrap"
                onClick={() => navigate("/recruiter/candidates")}
              >
                Xem tất cả <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
              </Badge>
            </div>
          </div>
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden flex-1">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap px-4 py-3">
                    Ứng viên
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap px-4 py-3">
                    Vị trí ứng tuyển
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap px-4 py-3 text-center">
                    Ngày nộp
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap px-4 py-3 text-center">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.recentApplications.map((app) => (
                  <TableRow
                    key={app._id}
                    className="hover:bg-indigo-50/30 transition-all duration-200 border-b border-gray-100"
                  >
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-gray-200 shrink-0">
                          <AvatarImage
                            src={app.applicant?.profile?.profilePhoto?.url}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {app.applicant?.fullname?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm md:text-base text-gray-900">
                            {app.applicant?.fullname}
                          </span>
                          <span className="text-xs text-gray-500">
                            {app.applicant?.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col max-w-[180px] md:max-w-[250px]">
                        <span className="font-medium text-sm md:text-base text-gray-900 truncate">
                          {app.job?.title}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {app.job?.company?.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center">
                      {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-center">
                      {getStatusBadge(app.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Popular Jobs */}
        <Card className="rounded-xl border-none shadow-lg overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-gray-50 to-slate-100 p-4 md:p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                Việc làm nổi bật
              </h2>
              <Badge
                variant="outline"
                className="cursor-pointer border-gray-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors whitespace-nowrap"
                onClick={() => navigate("/recruiter/jobs")}
              >
                Quản lý
              </Badge>
            </div>
          </div>
          <div className="p-4 md:p-5 space-y-3 md:space-y-4 flex-1 overflow-y-auto">
            {dashboardData.popularJobs.map((job) => (
              <div
                key={job._id}
                className="p-3 md:p-4 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm md:text-base text-gray-900 line-clamp-2">
                    {job.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="text-[10px] md:text-xs bg-indigo-100 text-indigo-700 font-medium whitespace-nowrap shrink-0 mt-0.5"
                  >
                    {job.applications?.length || 0} ứng viên
                  </Badge>
                </div>
                <p className="mt-1 text-xs md:text-sm text-gray-500 line-clamp-1">{job.location}</p>
                <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-[10px] md:text-xs border-cyan-200 bg-cyan-50 text-cyan-700"
                  >
                    {job.experienceLevel} năm
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] md:text-xs border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    {job.salary} triệu
                  </Badge>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">
                    Cập nhật: {new Date(job.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{(job.applications?.length || 0) * 2.5}% tăng</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// StatsCard làm đẹp & gọn hơn trên mobile
const StatsCard = ({
  icon,
  iconBg,
  label,
  value,
  badge,
  trend,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number | string;
  badge: string;
  trend?: string;
}) => {
  const isPositive = trend?.startsWith("+");
  const isNeutral = trend === "0%";

  return (
    <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        <div className={`${iconBg} p-3 md:p-4`}>
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm shrink-0">
              {icon}
            </div>
            <Badge
              variant="secondary"
              className="bg-white/90 text-gray-700 font-medium shadow-sm text-[10px] md:text-xs whitespace-nowrap"
            >
              {badge}
            </Badge>
          </div>
        </div>
        <div className="p-4 md:p-5 bg-white flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs md:text-sm font-medium text-gray-500 line-clamp-1">{label}</p>
            <p className="mt-1 md:mt-2 text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
          </div>

          {trend && (
            <div className="mt-3 md:mt-4 flex items-center gap-2">
              {isNeutral ? (
                <div className="flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full bg-gray-100">
                  <Minus className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
                  <span className="text-xs md:text-sm font-medium text-gray-500">
                    {trend}
                  </span>
                </div>
              ) : isPositive ? (
                <div className="flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full bg-emerald-100">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-emerald-600" />
                  <span className="text-xs md:text-sm font-medium text-emerald-600">
                    {trend}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full bg-rose-100">
                  <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-rose-600" />
                  <span className="text-xs md:text-sm font-medium text-rose-600">
                    {trend}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Recruiter;