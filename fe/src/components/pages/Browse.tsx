import Navbar from "../shared/Navbar";
import Job from "./components/Job";
import FilterCard from "./components/FilterCard"; // Nhớ import FilterCard
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAllJobs, setSearchedQuery } from "@/redux/jobSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/utils/constant";
import { Search, Filter,  ChevronDown, X } from "lucide-react";

const Browse = () => {
  const { user } = useSelector((store: RootState) => store.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle

  // State quản lý bộ lọc từ FilterCard
  const [filters, setFilters] = useState<{
    location: string[];
    jobType: string[];
    salary: string[];
  }>({
    location: [],
    jobType: [],
    salary: [],
  });

  const [filterSearchText, setFilterSearchText] = useState("");

  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/recruiter");
    }

    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get(`${API}/save-job/`, {
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
    if (user) fetchSavedJobs();
  }, [user, navigate]);

  const onJobSaveChange = async (jobId: string, isSaved: boolean) => {
    try {
      if (isSaved) {
        await axios.post(`${API}/save-job/save/${jobId}`, {}, { withCredentials: true });
        setSavedJobs((prev) => [...prev, jobId]);
      } else {
        await axios.delete(`${API}/save-job/unsave/${jobId}`, { withCredentials: true });
        setSavedJobs((prev) => prev.filter((id) => id !== jobId));
      }
    } catch (error) {
      console.error("Lỗi khi thao tác với công việc đã lưu:", error);
    }
  };

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${API}/job/all-jobs`);
        dispatch(setAllJobs(res.data.jobs));
      } catch (err) {
        console.error("Lỗi khi fetch jobs:", err);
      }
    };
    fetchAllJobs();
  }, [dispatch]);

  // Đọc từ khóa (query) và bộ lọc từ URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query") || "";
    dispatch(setSearchedQuery(query));

    setFilters({
      location: queryParams.get("location")?.split(",").filter(Boolean) || [],
      jobType: queryParams.get("jobType")?.split(",").filter(Boolean) || [],
      salary: queryParams.get("salary")?.split(",").filter(Boolean) || [],
    });
  }, [location.search, dispatch]);

  const { allJobs, searchedQuery } = useSelector(
    (store: RootState) => store.job
  );

  // Logic xử lý khi click Checkbox trong FilterCard
  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => {
      const currentList = prev[type as keyof typeof filters];
      if (currentList.includes(value)) {
        return { ...prev, [type]: currentList.filter((item) => item !== value) };
      } else {
        return { ...prev, [type]: [...currentList, value] };
      }
    });
  };

  const handleResetFilters = () => {
    setFilters({ location: [], jobType: [], salary: [] });
    setFilterSearchText("");
    dispatch(setSearchedQuery(""));
    navigate("/browse");
  };

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

  // LOGIC LỌC TỔNG HỢP (Kết hợp URL Query + FilterCard + TextSearch FilterCard)
  const filteredJobs = allJobs.filter((job) => {
    const isActive = job.status === "active" && job.approval === "approved";
    if (!isActive) return false;

    // 1. Lọc theo URL Query (searchedQuery)
    const keyword = searchedQuery.toLowerCase();
    const matchQuery =
      !keyword ||
      job.title.toLowerCase().includes(keyword) ||
      job.location.toLowerCase().includes(keyword) ||
      job.company.name.toLowerCase().includes(keyword) ||
      job.category.toLowerCase().includes(keyword);

    // 2. Lọc theo ô Text Search nhỏ trong FilterCard
    const filterKeyword = filterSearchText.toLowerCase();
    const matchFilterText = !filterKeyword || job.title.toLowerCase().includes(filterKeyword);

    // 3. Lọc theo Checkbox (Location)
    const matchLocation =
      filters.location.length === 0 ||
      filters.location.some((loc) => {
        const filterNorm = normalize(loc);
        const candidates = [job.location, job.company?.location, job.company?.name];
        return candidates.some((candidate) => {
          const candidateNorm = normalize(candidate || "");
          return candidateNorm.includes(filterNorm) || filterNorm.includes(candidateNorm);
        });
      });

    // 4. Lọc theo Checkbox (Category / Job Type)
    const matchJobType =
      filters.jobType.length === 0 ||
      filters.jobType.some((type) => {
        const filterNorm = normalize(type);
        const candidates = [job.category, job.jobType, job.title];
        return candidates.some((candidate) => {
          const candidateNorm = normalize(candidate || "");
          return candidateNorm.includes(filterNorm) || filterNorm.includes(candidateNorm);
        });
      });

    // 5. Lọc theo Checkbox (Salary)
    const matchSalary =
      filters.salary.length === 0 ||
      filters.salary.some((range) => {
        const salaryValue = getSalaryValue(job.salary);
        if (range === "Thỏa thuận") return salaryValue <= 0;
        if (range === "Dưới 5 triệu") return salaryValue < 5;
        if (range === "5 - 10 triệu") return salaryValue >= 5 && salaryValue <= 10;
        if (range === "10 - 15 triệu") return salaryValue >= 10 && salaryValue <= 15;
        if (range === "15 - 20 triệu") return salaryValue >= 15 && salaryValue <= 20;
        if (range === "Trên 20 triệu") return salaryValue > 20;
        return false;
      });

    return matchQuery && matchFilterText && matchLocation && matchJobType && matchSalary;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/50">
      <Navbar />

      {/* Header Result */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-xl">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  Khám phá việc làm
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Tìm thấy <span className="text-blue-600">{filteredJobs.length}</span> cơ hội phù hợp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "grid" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Lưới
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Danh sách
                </button>
              </div>

              {/* Sort */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="title">Theo tên A-Z</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Mobile Filter Btn */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-sm font-medium whitespace-nowrap"
              >
                <Filter className="w-4 h-4" />
                Bộ lọc
              </button>
            </div>

          </div>

          {/* Current Search Tag */}
          {searchedQuery && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Từ khóa:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-medium">
                {searchedQuery}
                <X 
                  className="w-3.5 h-3.5 cursor-pointer hover:text-red-500 transition-colors" 
                  onClick={() => {
                    dispatch(setSearchedQuery(""));
                    navigate("/browse");
                  }}
                />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Layout 2 Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cột Trái: Bộ Lọc (Hiển thị dạng sidebar trên Desktop, Offcanvas trên Mobile) */}
          <div className={`
            fixed inset-0 z-50 lg:static lg:z-0 lg:block lg:w-[280px] flex-shrink-0
            ${showFilters ? "block" : "hidden"}
          `}>
            {/* Overlay mobile */}
            <div 
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            
            {/* Filter Content */}
            <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm bg-white lg:static lg:w-full lg:bg-transparent overflow-y-auto lg:overflow-visible h-full shadow-2xl lg:shadow-none transition-transform duration-300">
              {/* Nút đóng trên Mobile */}
              <div className="flex justify-between items-center p-4 border-b lg:hidden">
                <h2 className="font-bold text-lg">Bộ lọc</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-4 lg:p-0">
                <FilterCard 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                  onSearchChange={setFilterSearchText}
                />
              </div>
            </div>
          </div>

          {/* Cột Phải: Danh sách Job (Chiếm phần còn lại) */}
          <div className="flex-1 min-w-0">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy việc làm phù hợp
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
                  Thử tìm kiếm với từ khóa khác hoặc xóa bớt tiêu chí lọc bên trái nhé!
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div
                className={`
                ${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                    : "flex flex-col gap-4"
                }
              `}
              >
                {sortedJobs.map((job) => (
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
  );
};

export default Browse;