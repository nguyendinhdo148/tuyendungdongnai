import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { API } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setApplications } from "@/redux/applicationSlice";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import CommonSkeleton from "../components/Skeleton/CommonSkeleton";
import ActionButtons from "../components/ActionButtons";
import { PaginationButtons } from "@/components/helpers/PaginationButtons";
import { paginate } from "@/components/helpers/pagination";
import { Button } from "@/components/ui/button";

const Candidates = () => {
  const { applications } = useSelector((store: RootState) => store.application);
  const [isLoading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 whitespace-nowrap">Đang xem xét</Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 whitespace-nowrap">Đã chấp nhận</Badge>
        );
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 whitespace-nowrap">Đã từ chối</Badge>;
      default:
        return null;
    }
  };

  const fetchApplications = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/application/applicantsForRecruiter`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setApplications(res.data.applications));
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Lỗi khi tải danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleAcceptAndReject = async (
    applicationId: string,
    status: string
  ) => {
    try {
      const res = await axios.put(
        `${API}/application/update-application-status/${applicationId}`,
        {
          status: status,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        fetchApplications();
        toast.success(
          status === "accepted"
            ? "Chấp nhận ứng viên thành công"
            : "Từ chối ứng viên thành công"
        );
      }
    } catch (error) {
      console.error("Error accepting application:", error);
      toast.error("Lỗi khi chấp nhận ứng viên");
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 6; // Number of jobs per page

  // Filter applications based on search term
  const filteredApplications = applications.filter((app) => {
    const fullName = app.applicant?.fullname.toLowerCase();
    const email = app.applicant?.email.toLowerCase();
    const jobTitle = app.job?.title.toLowerCase();
    const term = searchTerm.toLowerCase();
    return (
      fullName?.includes(term) ||
      email?.includes(term) ||
      jobTitle?.includes(term)
    );
  });

  // Calculate total pages for pagination based on filtered applications
  const { paginatedData: paginatedCandidates, totalPages } = paginate(
    filteredApplications,
    currentPage,
    itemPerPage
  );

  const candidatesRef = useRef<HTMLDivElement | null>(null);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    candidatesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // handle refresh
  const handleRefresh = () => {
    setLoading(true);
    fetchApplications();
  };

  if (isLoading) {
    return <CommonSkeleton />;
  }

  return (
    <div ref={candidatesRef} className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl shadow-lg shrink-0">
          <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
            Quản lý ứng viên
          </h1>
          <p className="mt-1 text-xs md:text-sm text-gray-500 line-clamp-1">
            Xem và quản lý danh sách ứng viên
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 md:p-6 shadow-sm border border-gray-200 rounded-xl">
        <div className="flex flex-col gap-4">
          {/* Thanh tìm kiếm & Tải lại chung 1 hàng trên mobile */}
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm ứng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 md:h-10 rounded-xl border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 md:h-10 cursor-pointer border border-gray-300 hover:border-gray-400 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 whitespace-nowrap shrink-0"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Tải lại</span>
            </Button>
          </div>

          {/* Badges vuốt ngang trên mobile */}
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden">
            <Badge
              variant="outline"
              className="cursor-pointer rounded-full border-gray-300 px-3 py-1 text-xs md:text-sm hover:bg-gray-100 whitespace-nowrap shrink-0"
            >
              Tất cả ({applications.length})
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer rounded-full px-3 py-1 text-xs md:text-sm hover:bg-yellow-50 text-yellow-700 border-yellow-300 whitespace-nowrap shrink-0"
            >
              Đang xem ({applications.filter((app) => app.status === "pending").length})
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer rounded-full px-3 py-1 text-xs md:text-sm hover:bg-green-50 text-green-700 border-green-300 whitespace-nowrap shrink-0"
            >
              Đã nhận ({applications.filter((app) => app.status === "accepted").length})
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer rounded-full px-3 py-1 text-xs md:text-sm hover:bg-red-50 text-red-700 border-red-300 whitespace-nowrap shrink-0"
            >
              Từ chối ({applications.filter((app) => app.status === "rejected").length})
            </Badge>
          </div>
        </div>
      </Card>

      {/* Candidates List */}
      <Card className="shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-0 md:p-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-[250px] text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                  Ứng viên
                </TableHead>
                <TableHead className="w-[200px] text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                  Vị trí ứng tuyển
                </TableHead>
                <TableHead className="text-gray-700 font-semibold text-center whitespace-nowrap px-4 py-3">
                  Số điện thoại
                </TableHead>
                <TableHead className="text-gray-700 font-semibold text-center whitespace-nowrap px-4 py-3">
                  Ngày ứng tuyển
                </TableHead>
                <TableHead className="text-gray-700 font-semibold text-center whitespace-nowrap px-4 py-3">
                  Trạng thái
                </TableHead>
                <TableHead className="w-[100px] text-center text-gray-700 font-semibold whitespace-nowrap px-4 py-3">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCandidates.length > 0 ? (
                paginatedCandidates.map((app) => (
                  <TableRow
                    key={app._id}
                    className="hover:bg-gray-50 transition border-b border-gray-100"
                  >
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 md:h-10 md:w-10 rounded-full shadow shrink-0">
                          <AvatarImage
                            src={
                              app.applicant?.profile?.profilePhoto?.url || ""
                            }
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {app.applicant?.fullname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm md:text-base text-gray-900">
                            {app.applicant?.fullname}
                          </span>
                          <span className="text-xs text-gray-500">
                            {app.applicant?.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-sm md:text-base text-gray-900 max-w-[200px] truncate">
                        {app.job?.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {app.job?.company.name}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="font-medium text-sm text-gray-800">
                        0{app.applicant?.phoneNumber}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right whitespace-nowrap">
                      <ActionButtons
                        applicant={app.applicant}
                        status={app.status}
                        onView={() => console.log("Xem chi tiết", app._id)}
                        onAccept={() =>
                          handleAcceptAndReject(app._id, "accepted")
                        }
                        onReject={() =>
                          handleAcceptAndReject(app._id, "rejected")
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="text-gray-500 text-sm md:text-base flex flex-col items-center gap-2">
                      <span>📭 Không có ứng viên nào</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination Buttons */}
      <PaginationButtons
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Candidates;