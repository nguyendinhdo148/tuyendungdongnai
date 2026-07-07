import { useSelector } from "react-redux";
import LatestJobCards from "./LatestJobCards";
import type { RootState } from "@/redux/store";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { paginate } from "./helpers/pagination";
import { PaginationButtons } from "./helpers/PaginationButtons";
import { Button } from "./ui/button";
import LatestJobsSkeleton from "./skeletons/LatestJobsSkeleton";
import { useSearchParams } from "react-router-dom";
import NoJobFound from "./helpers/NoJobFound";
import { motion } from "framer-motion";
import {
  fadeIn,
  buttonHover,
  buttonTap,
  slideInLeft,
  slideInRight,
} from "./../framer-motion-config";
import { Filter, TrendingUp, Users } from "lucide-react";

// Data cho Banner Slider
const banners = [
  {
    id: 1,
    image: "/bannerjob/bannerjob1.png",
    title: "Nhà hàng Lounge Dining",
  },
  {
    id: 2,
    image: "/bannerjob/bannerjob2.png",
    title: "Việc Làm Hành Chính, Văn Phòng",
  },
  {
    id: 3,
    image: "/bannerjob/bannerjob3.png",
    title: "Tiệm cà phê chuyên nghiệp",
  },
];

const LatestJobs = () => {
  const { allJobs } = useSelector((store: RootState) => store.job);

  const jobsRef = useRef<HTMLDivElement | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = Number.parseInt(searchParams.get("page") || "1");
  const categoryParam = searchParams.get("category") || "all";

  const [currentPage, setCurrentPage] = useState(pageParam);
  const [filterCategory, setFilterCategory] = useState(categoryParam);
  
  // State cho Slider
  const [currentSlide, setCurrentSlide] = useState(0);

  const itemPerPage = 12;
  const categories = [
    "all",
    "it",
    "marketing",
    "design",
    "sales",
    "banking",
    "education",
    "accountant",
    "real estate",
  ];

  const activeJobs = useMemo(
    () =>
      allJobs.filter(
        (job) => job.status === "active" && job.approval === "approved"
      ),
    [allJobs]
  );

  // Lọc công việc theo category
  const filteredJobs = useMemo(() => {
    if (filterCategory === "all") return activeJobs;
    return activeJobs.filter(
      (job) =>
        job.category &&
        job.category.toLowerCase() === filterCategory.toLowerCase()
    );
  }, [activeJobs, filterCategory]);

  // Tính toán phân trang
  const { paginatedData: paginatedJobs, totalPages } = useMemo(
    () => paginate(filteredJobs, currentPage, itemPerPage),
    [filteredJobs, currentPage]
  );

  // Hàm xử lý thay đổi category
  const handleCategoryChange = useCallback(
    (category: string) => {
      setCurrentPage(1);
      setFilterCategory(category);
      setSearchParams({ page: "1", category });
    },
    [setSearchParams]
  );

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString(), category: filterCategory });
  };

  useEffect(() => {
    const pageFromUrl = Number.parseInt(searchParams.get("page") || "1");
    const categoryFromUrl = searchParams.get("category") || "all";

    setCurrentPage(pageFromUrl);
    setFilterCategory(categoryFromUrl);

    if (jobsRef.current) {
      jobsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchParams]);

  // Auto-play cho Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (allJobs.length === 0) {
    return <LatestJobsSkeleton />;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 min-h-screen relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div
        ref={jobsRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10"
      >
        {/* --- SPLIT LAYOUT: HEADER LỆCH TRÁI & SLIDER LỆCH PHẢI --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-8">
          
          {/* CỘT TRÁI: Text & Stats */}
          <div className="lg:col-span-5 flex flex-col space-y-6 order-2 lg:order-1">
            {/* Icon Badge */}

            {/* Title */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                <span className="block text-gray-900 mb-2">Việc làm</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
                  mới nhất và hàng đầu
                </span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Khám phá những cơ hội nghề nghiệp tuyệt vời từ các công ty hàng đầu. Đừng bỏ lỡ công việc mơ ước của bạn!
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-green-500 shrink-0" />
                <span>
                  <strong className="text-gray-900">{activeJobs.length}</strong> đang tuyển
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-blue-500 shrink-0" />
                <span>
                  <strong className="text-gray-900">500+</strong> đối tác
                </span>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Banner Slider */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 relative order-1 lg:order-2 w-full h-[220px] sm:h-[300px] lg:h-[360px] rounded-3xl overflow-hidden shadow-2xl group"
          >
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent z-10" />
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20">
                  <h3 className="text-xl sm:text-3xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-md">
                    {banner.title}
                  </h3>
                </div>
              </div>
            ))}

            {/* Nút điều hướng Slide (Dots) */}
            <div className="absolute bottom-5 left-0 right-0 z-30 flex justify-center gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "w-8 bg-blue-500" : "w-2 bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Chuyển slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
        {/* -------------------------------------------------------- */}

        {/* Enhanced Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-200/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Lọc theo ngành nghề
            </h3>
          </div>

          <motion.div variants={fadeIn} className="flex gap-3 flex-wrap">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                variants={index % 2 === 0 ? slideInLeft : slideInRight}
                custom={index}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <Button
                  className={`px-5 py-2.5 rounded-2xl text-sm font-semibold cursor-pointer transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg hover:-translate-y-0.5
                    ${
                      filterCategory === category
                        ? "bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white border-transparent shadow-lg scale-105"
                        : "bg-white/90 text-gray-700 border-2 border-gray-200 hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50/50"
                    }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category === "all" ? "Tất cả" : category.toUpperCase()}
                  {filterCategory === category && (
                    <div className="ml-2 w-2 h-2 bg-white/80 rounded-full animate-pulse"></div>
                  )}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Filter Results Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Hiển thị{" "}
                <strong className="text-gray-900">
                  {paginatedJobs.length}
                </strong>{" "}
                trong tổng số{" "}
                <strong className="text-gray-900">{filteredJobs.length}</strong>{" "}
                việc làm
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                Trang {currentPage} / {totalPages}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Job Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedJobs.length === 0 ? (
            <div className="col-span-full">
              <NoJobFound />
            </div>
          ) : (
            paginatedJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <LatestJobCards job={job} />
              </motion.div>
            ))
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200/60">
              <PaginationButtons
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestJobs;