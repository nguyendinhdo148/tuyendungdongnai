import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../shared/Navbar";
import FilterCard from "./components/FilterCard";
import Job from "./components/Job";
import { RootState } from "@/redux/store";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import NoJobFound from "../helpers/NoJobFound";
import axios from "axios";
import { API } from "@/utils/constant";
import toast from "react-hot-toast";
import { Filter, X } from "lucide-react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async"; // THÊM IMPORT HELMET

const Jobs = () => {
  const { user } = useSelector((store: RootState) => store.auth);
  const { allJobs } = useSelector((store: RootState) => store.job);
  const [searchText, setSearchText] = useState("");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/recruiter");
    }

    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get(`${API}/save-job`, {
          withCredentials: true,
        });
        const savedJobIds = response.data.savedJobs.map(
          (savedJob: { job: { _id: string } }) => savedJob.job._id
        );
        setSavedJobs(savedJobIds);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách công việc đã lưu:", error);
      }
    };
    fetchSavedJobs();
  }, [user, navigate]);

  const onJobSaveChange = async (jobId: string, isSaved: boolean) => {
    try {
      if (isSaved) {
        await axios.post(
          `${API}/save-job/save/${jobId}`,
          {},
          {
            withCredentials: true,
          }
        );
        setSavedJobs((prev) => [...prev, jobId]);
        toast.success("Lưu thành công!");
      } else {
        await axios.delete(`${API}/save-job/unsave/${jobId}`, {
          withCredentials: true,
        });
        setSavedJobs((prev) => prev.filter((id) => id !== jobId));
        toast.success("Bỏ lưu thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi thao tác với công việc đã lưu:", error);
    }
  };

  const [filters, setFilters] = useState({
    location: [] as string[],
    jobType: [] as string[],
    salary: [] as string[],
  });

  useGetAllJobs();

  useEffect(() => {
    const queryFilters = {
      location: searchParams.get("location")?.split(",") || [],
      jobType: searchParams.get("jobType")?.split(",") || [],
      salary: searchParams.get("salary")?.split(",") || [],
    };
    setFilters(queryFilters);
    setSearchText(searchParams.get("query") || "");
  }, [searchParams]);

  const updateURL = (updatedFilters: typeof filters, search?: string) => {
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(","));
      }
    });
    if (search) {
      params.set("query", search);
    }
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => {
      const current = prev[type as keyof typeof prev];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const newFilters = { ...prev, [type]: updated };
      updateURL(newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    const cleared = { location: [], jobType: [], salary: [] };
    setFilters(cleared);
    updateURL(cleared);
  };

  const activeFilterCount = Object.values(filters).reduce(
    (acc, arr) => acc + arr.length,
    0
  );

  const normalize = (text: string = "") =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s/g, "")
      .replace(/\./g, "");

  const getSalaryValue = (value: number | string | undefined) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = Number(value.replace(/[^0-9.]/g, ""));
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const filteredJobs = allJobs.filter((job) => {
    const matchLocation =
      filters.location.length === 0 ||
      filters.location.some((filterLoc) => {
        const candidates = [job.location, job.company?.location, job.company?.name];
        const filterNorm = normalize(filterLoc);
        return candidates.some((candidate) => {
          const candidateNorm = normalize(candidate || "");
          return (
            candidateNorm.includes(filterNorm) ||
            filterNorm.includes(candidateNorm)
          );
        });
      });

    const matchJobType =
      filters.jobType.length === 0 ||
      filters.jobType.some((filter) => {
        const filterNorm = normalize(filter);
        const candidates = [job.category, job.jobType, job.title];
        return candidates.some((candidate) => {
          const candidateNorm = normalize(candidate || "");
          return (
            candidateNorm.includes(filterNorm) ||
            filterNorm.includes(candidateNorm)
          );
        });
      });

    const matchSalary =
      filters.salary.length === 0 ||
      filters.salary.some((range) => {
        const salaryValue = getSalaryValue(job.salary);
        if (range === "Thỏa thuận") {
          return salaryValue <= 0;
        }
        if (range === "Dưới 5 triệu") {
          return salaryValue < 5;
        }
        if (range === "5 - 10 triệu") {
          return salaryValue >= 5 && salaryValue <= 10;
        }
        if (range === "10 - 15 triệu") {
          return salaryValue >= 10 && salaryValue <= 15;
        }
        if (range === "15 - 20 triệu") {
          return salaryValue >= 15 && salaryValue <= 20;
        }
        if (range === "Trên 20 triệu") {
          return salaryValue > 20;
        }
        return false;
      });

    const normalizedSearchText = normalize(searchText);
    const matchSearch =
      normalizedSearchText === "" ||
      normalize(job.title).includes(normalizedSearchText) ||
      normalize(job.company.location || "").includes(normalizedSearchText) ||
      normalize(job.company.name).includes(normalizedSearchText) ||
      normalize(job.jobType || "").includes(normalizedSearchText);

    return (
      job.approval === "approved" &&
      job.status === "active" &&
      matchLocation &&
      matchJobType &&
      matchSalary &&
      matchSearch
    );
  });

  return (
    <div>
      {/* TỐI ƯU SEO TRANG DANH SÁCH */}
      <Helmet>
        <title>Tìm Việc Làm Tại Bình Phước & Đồng Nai - Cập Nhật Mới Nhất</title>
        <meta name="description" content="Khám phá hàng ngàn cơ hội việc làm mới nhất, đa dạng ngành nghề với mức lương hấp dẫn tại Tuyển Dụng Đồng Nai. Lọc và tìm kiếm công việc phù hợp với bạn ngay!" />
      </Helmet>

      <Navbar />
      <div className="pt-20 md:pt-24 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Desktop Filter - Always visible */}
          <div className="hidden lg:block w-[240px] xl:w-[280px] sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden pb-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100/80 p-3 sm:p-4">
              <FilterCard
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
                onSearchChange={(text) => {
                  setSearchText(text);
                  updateURL(filters, text);
                }}
              />
            </div>
          </div>

          {/* Jobs Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Header - Filter Button + Results count */}
            <div className="lg:hidden sticky top-20 bg-white z-20 py-3 px-1 border-b border-gray-100/80">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    <span className="text-indigo-600 font-bold text-base">
                      {filteredJobs.length}
                    </span>{" "}
                    việc làm
                  </h2>
                  {activeFilterCount > 0 && (
                    <span className="text-xs text-indigo-600">
                      Đang lọc {activeFilterCount} mục
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => setShowMobileFilter(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm shadow-md"
                >
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Bộ lọc
                  {activeFilterCount > 0 && (
                    <span className="ml-0.5 bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Mobile Search */}
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Tìm kiếm việc làm..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    updateURL(filters, e.target.value);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm"
                />
              </div>
            </div>

            {/* Desktop job count */}
            <div className="hidden lg:block mb-4">
              <h2 className="text-sm font-medium text-gray-500">
                Tìm thấy{" "}
                <span className="text-indigo-600 font-bold">
                  {filteredJobs.length}
                </span>{" "}
                việc làm
              </h2>
            </div>

            {/* Jobs Grid */}
            <div className="lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 pb-5">
              {filteredJobs.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <NoJobFound />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {filteredJobs.map((job) => (
                    <Job
                      key={job._id}
                      job={job}
                      savedJobs={savedJobs}
                      onJobSaveChange={onJobSaveChange}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter - Bottom Sheet */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilter(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col"
            >
              {/* Handle bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto flex-shrink-0" />
                  <h3 className="text-base font-semibold text-gray-800">
                    Bộ lọc
                  </h3>
                  {activeFilterCount > 0 && (
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                      {activeFilterCount} mục
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => {
                        resetFilters();
                      }}
                      className="text-xs text-indigo-600 font-medium hover:text-indigo-700"
                    >
                      Xóa tất cả
                    </button>
                  )}
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Filter content - scrollable */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <FilterCard
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={() => {
                    resetFilters();
                  }}
                  onSearchChange={(text) => {
                    setSearchText(text);
                    updateURL(filters, text);
                  }}
                />
              </div>

              {/* Bottom actions */}
              <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
                <Button
                  onClick={() => setShowMobileFilter(false)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg"
                >
                  Áp dụng bộ lọc
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;