import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  ClipboardList,
  Edit2,
  Eye,
  FileText,
  MapPin,
  Plus,
  Trash2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API } from "@/utils/constant";
import Swal from "sweetalert2";
import { JobFormDialog } from "../components/JobFormDialog";
import { setJobsForRecruiter, setSelectedJob } from "@/redux/jobSlice";
import type { RootState } from "@/redux/store";
import type { JobFormData } from "../components/JobFormDialog";
import { paginate } from "@/components/helpers/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { JobDetailDialog } from "../components/JobDetailDialog";
import { Job } from "@/types/job";
import { PaginationButtons } from "@/components/helpers/PaginationButtons";
import CommonSkeleton from "../components/Skeleton/CommonSkeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const JobManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetailJob, setSelectedDetailJob] = useState<Job | null>(null);

  const dispatch = useDispatch();
  const { jobsForRecruiter, selectedJob } = useSelector(
    (store: RootState) => store.job
  );

  // filter jobs by status
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [approvalNoteFilter, setApprovalNoteFilter] = useState(false);

  const filteredJobs = jobsForRecruiter.filter((job) => {
    const statusMatch =
      statusFilter === "all" ? true : job.status === statusFilter;
    const approvalMatch =
      approvalFilter === "all" ? true : job.approval === approvalFilter;
    const noteMatch = approvalNoteFilter ? job.approvalNote?.length > 0 : true;
    return statusMatch && approvalMatch && noteMatch;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6; // Number of jobs per page

  const { paginatedData: paginatedJobs, totalPages } = paginate(
    filteredJobs,
    currentPage,
    jobsPerPage
  );

  // Reset current page when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Reset current page when approval filter changes
  const fetchJobs = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/job/recruiter-jobs`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setJobsForRecruiter(response.data.jobs));
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
      toast.error("Không thể tải danh sách việc làm");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Handle add job
  const handleAddJob = async (formData: JobFormData) => {
    try {
      const response = await axios.post(
        `${API}/job/create-job`,
        {
          ...formData,
          requirements: formData.requirements,
          benefits: formData.benefits,
          salary: formData.salary,
          company: formData.company._id,
          category: formData.category,
          status: formData.status,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Đăng tin tuyển dụng thành công!");
        await fetchJobs();
      }
    } catch (error) {
      console.error("Add job error:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data.message
          : "Không thể đăng tin tuyển dụng mới"
      );
    }
  };

  // Handle edit job
  const handleEditJob = async (formData: JobFormData) => {
    if (!selectedJob) return;

    try {
      const response = await axios.put(
        `${API}/job/update-job/${selectedJob._id}`,
        {
          ...formData,
          requirements: formData.requirements,
          benefits: formData.benefits,
          salary: formData.salary,
          company: formData.company._id,
          category: formData.category,
          status: formData.status,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Cập nhật tin tuyển dụng thành công!");
        await fetchJobs();
      }
    } catch (error) {
      console.error("Edit job error:", error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data.message
          : "Không thể cập nhật tin tuyển dụng"
      );
    }
  };

  // Handle delete job
  const handleDelete = async (job_id: string) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xóa tin tuyển dụng này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`${API}/job/delete-job/${job_id}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        await fetchJobs();
        toast.success("Xóa tin tuyển dụng thành công!");
      }
    } catch (error) {
      console.error("Delete job error:", error);
      toast.error("Không thể xóa tin tuyển dụng");
    }
  };

  const jobsRef = useRef<HTMLDivElement | null>(null);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    jobsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    fetchJobs();
  };

  if (isLoading) return <CommonSkeleton />;

  return (
    <div ref={jobsRef} className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl shadow-lg shrink-0">
            <ClipboardList className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
              Quản lý việc làm
            </h1>
            <p className="mt-1 text-xs md:text-sm text-gray-500 line-clamp-1">
              Đăng và quản lý các tin tuyển dụng của bạn
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="md:h-11 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:shadow-lg transition whitespace-nowrap self-start md:self-auto"
          onClick={() => {
            dispatch(setSelectedJob(null));
            setIsDialogOpen(true);
          }}
        >
          <div className="flex items-center gap-2">
            <Plus className="size-4 md:size-5" />
            <span className="text-sm md:text-[16px]">Đăng tin mới</span>
          </div>
        </Button>
      </div>

      {/* Filters: Vuốt ngang trên mobile */}
      <div className="flex overflow-x-auto gap-3 pb-2 items-center scrollbar-hide [&::-webkit-scrollbar]:hidden w-full mb-2 md:mb-4">
        {/* Status Filter */}
        <div className="flex gap-2 items-center shrink-0">
          <label className="text-sm text-gray-600 font-medium whitespace-nowrap">
            Trạng thái:
          </label>
          <Select
            onValueChange={(value) => setStatusFilter(value)}
            defaultValue="all"
          >
            <SelectTrigger className="w-[140px] md:w-[180px] h-9 md:h-10 border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-all duration-200 cursor-pointer text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg rounded-md border border-gray-200 hover:shadow-xl transition-all duration-200">
              <SelectItem value="all" className="cursor-pointer hover:bg-gray-100 text-sm">
                Tất cả
              </SelectItem>
              <SelectItem value="active" className="cursor-pointer hover:bg-gray-100 text-sm">
                Hoạt động
              </SelectItem>
              <SelectItem value="draft" className="cursor-pointer hover:bg-gray-100 text-sm">
                Nháp
              </SelectItem>
              <SelectItem value="closed" className="cursor-pointer hover:bg-gray-100 text-sm">
                Đã đóng
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Approval Filter */}
        <div className="flex gap-2 items-center shrink-0">
          <label className="text-sm text-gray-600 font-medium whitespace-nowrap">
            Duyệt:
          </label>
          <Select
            onValueChange={(value) => setApprovalFilter(value)}
            defaultValue="all"
          >
            <SelectTrigger className="w-[120px] md:w-[140px] h-9 md:h-10 border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-all duration-200 cursor-pointer text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg rounded-md border border-gray-200 hover:shadow-xl transition-all duration-200">
              <SelectItem value="all" className="cursor-pointer hover:bg-gray-100 text-sm">
                Tất cả
              </SelectItem>
              <SelectItem value="pending" className="cursor-pointer hover:bg-gray-100 text-sm">
                Chờ duyệt
              </SelectItem>
              <SelectItem value="approved" className="cursor-pointer hover:bg-gray-100 text-sm">
                Đã duyệt
              </SelectItem>
              <SelectItem value="rejected" className="cursor-pointer hover:bg-gray-100 text-sm">
                Từ chối
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Checkbox Ghi chú */}
        <div className="flex gap-2 items-center shrink-0 bg-white border border-gray-200 px-3 h-9 md:h-10 rounded-md shadow-sm">
          <input
            type="checkbox"
            id="hasNote"
            checked={approvalNoteFilter}
            onChange={(e) => setApprovalNoteFilter(e.target.checked)}
            className="rounded border-gray-300 cursor-pointer"
          />
          <label htmlFor="hasNote" className="text-sm text-gray-600 font-medium whitespace-nowrap cursor-pointer">
            Có ghi chú
          </label>
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 md:h-10 shrink-0 cursor-pointer border border-gray-300 hover:border-gray-400 transition-all duration-200 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          onClick={handleRefresh}
        >
          <RefreshCw className="w-4 h-4 md:mr-1" />
          <span className="hidden md:inline">Tải lại</span>
        </Button>

        {/* Count */}
        <div className="flex items-center gap-1 shrink-0 px-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Tổng:</span>
          <span className="text-sm font-medium text-gray-800">{filteredJobs.length}</span>
        </div>
      </div>

      <Card className="shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-0 md:p-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50/50 text-gray-700">
                <TableHead className="w-[180px] whitespace-nowrap px-4 py-3">Vị trí & Công ty</TableHead>
                <TableHead className="w-[180px] text-center whitespace-nowrap px-4 py-3">
                  Địa điểm
                </TableHead>
                <TableHead className="w-[120px] text-center whitespace-nowrap px-4 py-3">
                  Trạng thái
                </TableHead>
                <TableHead className="w-[120px] text-center whitespace-nowrap px-4 py-3">Duyệt</TableHead>
                <TableHead className="w-[100px] text-center whitespace-nowrap px-4 py-3">
                  Mức lương
                </TableHead>
                <TableHead className="w-[80px] text-center whitespace-nowrap px-4 py-3">KN</TableHead>
                <TableHead className="w-[80px] text-center whitespace-nowrap px-4 py-3">ƯV</TableHead>
                <TableHead className="w-[100px] text-center whitespace-nowrap px-4 py-3">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => (
                  <TableRow
                    key={job._id}
                    className="hover:bg-gray-50 transition-all duration-150 border-b border-gray-100"
                  >
                    <TableCell className="font-medium text-gray-800 max-w-[200px] md:max-w-[240px] truncate px-4 py-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block truncate cursor-default text-sm md:text-base">{job.title}</span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 text-white p-2 rounded-lg text-sm max-w-[250px] break-words">
                            {job.title}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-[150px] md:max-w-[200px] truncate px-4 py-3">
                      <MapPin className="size-4 mr-1 text-gray-500 inline" />
                      <span className="text-sm truncate">{job.location}</span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center whitespace-nowrap px-4 py-3">
                      <Badge
                        className={
                          "px-3 py-1 rounded-full font-medium shadow-sm " +
                          (job.status === "active"
                            ? "bg-green-100 text-green-700"
                            : job.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700")
                        }
                        variant="outline"
                        style={{ minWidth: 100, justifyContent: "center" }}
                      >
                        <div className="flex items-center justify-center whitespace-nowrap">
                          {job.status === "active" && (
                            <CheckCircle2 className="w-4 h-4 mr-1 text-green-500 shrink-0" />
                          )}
                          {job.status === "draft" && (
                            <FileText className="w-4 h-4 mr-1 text-yellow-500 shrink-0" />
                          )}
                          {job.status === "closed" && (
                            <XCircle className="w-4 h-4 mr-1 text-red-500 shrink-0" />
                          )}
                          <span>
                            {job.status === "active"
                              ? "Hoạt động"
                              : job.status === "draft"
                              ? "Nháp"
                              : "Đã đóng"}
                          </span>
                        </div>
                      </Badge>
                    </TableCell>

                    {/* Approval status */}
                    <TableCell className="text-center whitespace-nowrap px-4 py-3">
                      {job.approval === "rejected" ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                className="px-3 py-1 rounded-full font-medium bg-red-100 text-red-700 cursor-help"
                                variant="outline"
                                style={{
                                  minWidth: 100,
                                  justifyContent: "center",
                                }}
                              >
                                <div className="flex items-center gap-1 justify-center whitespace-nowrap">
                                  <XCircle className="w-4 h-4 shrink-0" />
                                  <span>Từ chối</span>
                                </div>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-900 text-white p-3 rounded-lg max-w-[250px] md:max-w-[300px] text-sm">
                              <p className="whitespace-pre-wrap">
                                Lý do: {job.approvalNote || "Không có"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Badge
                          className={
                            "px-3 py-1 rounded-full font-medium " +
                            (job.approval === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700")
                          }
                          variant="outline"
                          style={{ minWidth: 100, justifyContent: "center" }}
                        >
                          <div className="flex items-center gap-1 justify-center whitespace-nowrap">
                            {job.approval === "approved" ? (
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 shrink-0" />
                            )}
                            <span>{job.approval === "approved" ? "Đã duyệt" : "Chờ duyệt"}</span>
                          </div>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-800 font-medium text-center whitespace-nowrap px-4 py-3 text-sm">
                      {job.salary.toLocaleString()} Triệu
                    </TableCell>
                    <TableCell className="text-[14px] text-gray-800 font-medium text-center whitespace-nowrap px-4 py-3">
                      {job.experienceLevel} năm
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap px-4 py-3">
                      <Badge
                        variant="outline"
                        className="text-sm px-3 py-1 rounded-2xl font-medium shadow-sm bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all duration-200"
                        style={{ minWidth: 40, justifyContent: "center" }}
                      >
                        {job.applications?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap px-4 py-3">
                      <div className="flex justify-center items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-gray-100 cursor-pointer h-8 w-8"
                          title="Xem chi tiết"
                          onClick={() => {
                            setSelectedDetailJob(job);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-100 text-blue-600 cursor-pointer h-8 w-8"
                          onClick={() => {
                            dispatch(setSelectedJob(job));
                            setIsDialogOpen(true);
                          }}
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-100 text-red-600 cursor-pointer h-8 w-8"
                          onClick={() => handleDelete(job._id)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="text-gray-500 text-sm md:text-base flex flex-col items-center gap-2">
                      <span>📭 Không có tin tuyển dụng nào</span>
                      <span className="text-xs md:text-sm text-gray-400">
                        Hãy bắt đầu bằng cách đăng tin mới
                      </span>
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

      {/* Job Form Dialog */}
      <JobFormDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          dispatch(setSelectedJob(null));
        }}
        job={selectedJob}
        onSuccess={async (formData) => {
          try {
            if (selectedJob) {
              await handleEditJob(formData);
            } else {
              await handleAddJob(formData);
            }
            setIsDialogOpen(false);
            dispatch(setSelectedJob(null));
          } catch (error) {
            console.error("Form submission error:", error);
          }
        }}
      />

      {/* Job Detail Dialog */}
      <JobDetailDialog
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        job={selectedDetailJob}
      />
    </div>
  );
};

export default JobManager;