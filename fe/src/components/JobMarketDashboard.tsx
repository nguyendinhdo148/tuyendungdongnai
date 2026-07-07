import { RootState } from "@/redux/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ModernTrending from "./shared/ModernTrending";

const JobMarketDashboard = () => {
  // Lấy danh sách tất cả jobs từ Redux store
  const { allJobs } = useSelector((store: RootState) => store.job);

  // Job "active" và "approved" (top 3 mới nhất)
  const activeJobs = useMemo(
    () =>
      allJobs
        .filter((job) => job.status === "active" && job.approval === "approved")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3),
    [allJobs]
  );

  // Tổng số việc làm active & approved
  const activeJobsCount = useMemo(
    () =>
      allJobs.filter(
        (job) => job.status === "active" && job.approval === "approved"
      ).length,
    [allJobs]
  );

  // Việc làm đăng mới trong 24h gần nhất
  const jobsInLast24h = useMemo(() => {
    const now = new Date();
    return allJobs.filter((job) => {
      const createDate = new Date(job.createdAt);
      return (now.getTime() - createDate.getTime()) / (1000 * 60 * 60) <= 24;
    });
  }, [allJobs]);

  // Số công ty "đang tuyển"
  const companiesHiring = useMemo(() => {
    const set = new Set();
    allJobs.forEach((job) => {
      if (job.status === "active" && job.approval === "approved") {
        set.add(job.company._id || job.company._id);
      }
    });
    return set.size;
  }, [allJobs]);

  // Chart tăng trưởng số việc làm mới mỗi ngày (7 ngày gần nhất)
  const growthChart = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });
    const data = days.map((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return allJobs.filter((job) => {
        const c = new Date(job.createdAt);
        return c >= d && c < next;
      }).length;
    });
    // "Bình thường hóa" để hiển thị % cao-thấp cho trực quan, vì UI chart là tỷ lệ height
    const max = Math.max(...data, 1);
    return data.map((v) => Math.round((v / max) * 60 + 35)); // từ 35%-95%
  }, [allJobs]);

  // Gắn ngày cho trục chart (7 ngày gần nhất)
  const chartLabels = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    });
  }, []);

  // Ngày hôm nay
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Phân bổ nhu cầu theo mức lương (giả định field job.salaryMin và job.salaryMax, triệu VND)
  const salaryStats = useMemo(() => {
    const ranges = [
      { label: "Dưới 3 triệu", min: 0, max: 3 },
      { label: "Từ 3-10 triệu", min: 3, max: 10 },
      { label: "Từ 10-20 triệu", min: 10, max: 20 },
      { label: "Từ 20-30 triệu", min: 20, max: 30 },
      { label: "Trên 30 triệu", min: 30, max: Number.MAX_SAFE_INTEGER },
    ];
    const stats = Array(ranges.length).fill(0);
    allJobs.forEach((job) => {
      if (
        job.status === "active" &&
        job.approval === "approved" &&
        typeof job.salary === "number"
      ) {
        // Nếu salary ĐÃ là triệu: KHÔNG chia nữa!
        const salary = job.salary;
        ranges.forEach((r, idx) => {
          if (salary >= r.min && salary < r.max) {
            stats[idx]++;
          }
        });
      }
    });
    const total = stats.reduce((a, b) => a + b, 0) || 1;
    return stats.map((count, idx) => ({
      label: ranges[idx].label,
      value: Math.round((count / total) * 100),
      color: [
        "from-green-500 to-green-400",
        "from-blue-500 to-blue-400",
        "from-yellow-500 to-yellow-400",
        "from-orange-500 to-orange-400",
        "from-red-500 to-red-400",
      ][idx],
    }));
  }, [allJobs]);

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% {transform: translateX(0%);}
          100% {transform: translateX(-50%);}
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .pause-marquee:hover { animation-play-state: paused; }
        @keyframes float { 0%,100% {transform: translateY(0px);} 50% {transform: translateY(-10px);} }
        .float-animation { animation: float 3s ease-in-out infinite; }
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 20px rgba(34,197,94,0.3); } 50% { box-shadow: 0 0 30px rgba(34,197,94,0.6); } }
        .pulse-glow {animation: pulse-glow 2s ease-in-out infinite;}
      `}</style>

      <div className="py-8 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-green-600 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-32 h-32 md:w-40 md:h-40 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-32 right-32 w-16 h-16 md:w-24 md:h-24 bg-green-500/20 rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 md:w-32 md:h-32 bg-green-400/15 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-300 rounded-full opacity-80"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              Thị trường việc làm{" "}
              <span className="block sm:inline text-green-400 font-extrabold mt-1 sm:mt-0">
                {currentDate}
              </span>
            </h2>
            <div className="hidden sm:flex md:block">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500/20 rounded-full flex items-center justify-center pulse-glow">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8">
            {/* Left Column - Trending & Latest Jobs */}
            <div className="lg:col-span-4 space-y-5 md:space-y-8">
              {/* Modern Trending Illustration  */}
              <ModernTrending />

              {/* Latest Jobs */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50">
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-green-400">
                  Việc làm mới nhất
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {activeJobs.length === 0 && (
                    <p className="text-slate-400 text-sm">
                      Chưa có việc làm mới cập nhật.
                    </p>
                  )}
                  {activeJobs.map((job, index) => (
                    <Link
                      to={`/job/detail/${job.slug}`}
                      key={index}
                      className="block group"
                    >
                      <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer border border-slate-600/30">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg bg-slate-800 overflow-hidden">
                            <span className="text-white font-bold text-xs sm:text-sm">
                              {job.company.logo ? (
                                <img
                                  src={job.company.logo}
                                  alt={job.company.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                job.company.name.charAt(0).toUpperCase()
                              )}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-green-300 transition-colors">
                              {job.title}
                            </h4>
                            <p className="text-xs text-green-300 mb-0.5 sm:mb-1 truncate">
                              {job.company.name}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {job.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Column - Statistics */}
            <div className="lg:col-span-4 space-y-5 md:space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                <div className="col-span-2 sm:col-span-1 lg:col-span-1 bg-gradient-to-r from-green-600/20 to-green-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                    {jobsInLast24h.length.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-green-300 text-xs sm:text-sm font-medium">
                    Việc làm mới 24h qua
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                    {activeJobsCount.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-blue-300 text-xs sm:text-sm font-medium">
                    Đang tuyển dụng
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">
                    {companiesHiring.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-purple-300 text-xs sm:text-sm font-medium">
                    Công ty đối tác
                  </div>
                </div>
              </div>

              {/* Growth Chart */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  <h3 className="text-base sm:text-lg font-bold text-green-400">
                    Tăng trưởng cơ hội
                  </h3>
                </div>
                <div className="h-32 sm:h-40 flex items-end justify-between space-x-1 sm:space-x-2">
                  {growthChart.map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-md sm:rounded-t-lg shadow-lg hover:from-green-500 hover:to-green-300 transition-all duration-300"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between gap-1 text-[10px] sm:text-xs text-slate-400 mt-3 sm:mt-4">
                  {chartLabels.map((label, idx) => (
                    <span key={idx} className="truncate">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Demand Chart */}
            <div className="lg:col-span-4">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 h-full">
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
                    <h3 className="text-base sm:text-lg font-bold text-blue-400 line-clamp-1">
                      Nhu cầu tuyển dụng
                    </h3>
                  </div>
                  <button className="text-[10px] sm:text-xs bg-green-500/20 hover:bg-green-500/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-green-300 border border-green-500/30 transition-all duration-300 whitespace-nowrap">
                    Mức lương
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  {salaryStats.map((item, index) => (
                    <div key={index} className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-slate-300 font-medium">
                          {item.label}
                        </span>
                        <span className="text-white font-bold">
                          {item.value}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2.5 sm:h-3 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-1000 shadow-lg`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobMarketDashboard;