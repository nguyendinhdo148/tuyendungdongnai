import { Search, Loader2, Sparkles, Clock, X, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import FullScreenLoader from "./skeletons/FullScreenLoader";
import SuggestionList from "./helpers/SuggestionList";
import axios from "axios";
import { API } from "@/utils/constant";
import { RootState } from "@/redux/store";

interface SearchHistoryItem {
  _id: string;
  query: string;
  searchCount: number;
  lastSearchedAt: string;
}

// Data cho Banner Slider
const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
    title: "Kết Nối Nhân Tài Đồng Nai",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
    title: "Việc Làm Hành Chính, Văn Phòng",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop",
    title: "Tuyển Dụng Khu Công Nghiệp",
  },
];

// Từ khóa SEO phổ biến (như trên các Group FB)
const popularKeywords = [
  "Việc làm Phường Bình Phước",
  "Hành chính nhân sự",
  "Kế toán",
  "Tuyển công nhân",
  "Việc làm part-time",
];

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveringSlider, setIsHoveringSlider] = useState(false); // State mới để dừng auto-play

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store: RootState) => store.auth);

  const normalizeSearchText = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s/g, "")
      .replace(/\./g, "");

  // Đã refactor logic mapping để dễ mở rộng và quản lý hơn
  const inferFiltersFromQuery = (rawQuery: string) => {
    const query = normalizeSearchText(rawQuery);
    const filters = {
      location: [] as string[],
      jobType: [] as string[],
      salary: [] as string[],
    };

    const keywordMap = [
      { keys: ["binhphuoc", "phuongbinhphuoc"], type: "location", value: "Phường Bình Phước" },
      { keys: ["parttime", "part-time"], type: "jobType", value: "Part-Time" },
      { keys: ["hanhchinh", "nhansu", "nhânsu"], type: "jobType", value: "Hành chính nhân sự" },
      { keys: ["ketoan", "kiemtoan"], type: "jobType", value: "Kế toán / Kiểm toán" },
      { keys: ["congnhan", "sanxuat"], type: "jobType", value: "Công nhân sản xuất" },
      { keys: ["it", "phanmem"], type: "jobType", value: "IT / Phần mềm" },
      { keys: ["marketing"], type: "jobType", value: "Marketing" },
      { keys: ["banhang", "kinhdoanh"], type: "jobType", value: "Bán hàng / Kinh doanh" },
      { keys: ["fulltime", "toanthoigian"], type: "jobType", value: "Full-Time" },
      { keys: ["remote", "tuxa"], type: "jobType", value: "Remote" },
      { keys: ["thuctap", "intern"], type: "jobType", value: "Internship" },
      { keys: ["thoa-thuan", "thoathuan"], type: "salary", value: "Thỏa thuận" },
      { keys: ["duoi5", "duoi5trieu", "dưoi5"], type: "salary", value: "Dưới 5 triệu" },
    ];

    keywordMap.forEach(({ keys, type, value }) => {
      if (keys.some((k) => query.includes(k))) {
        filters[type as keyof typeof filters].push(value);
      }
    });

    return filters;
  };

  // Auto-play Slider - Đã thêm tính năng dừng khi hover
  useEffect(() => {
    if (isHoveringSlider) return; // Dừng auto-play nếu đang hover

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHoveringSlider]);

  const searchJobHandler = async (selectedQuery?: string, keepQuery = true) => {
    const finalQuery = selectedQuery || query;
    if (!finalQuery.trim()) return;
    setIsSearching(true);

    if (keepQuery) {
      dispatch(setSearchedQuery(finalQuery));
      if (user) {
        try {
          await axios.post(`${API}/search-history/save`, { query: finalQuery }, { withCredentials: true });
        } catch (error) {
          console.error("Failed to save search history:", error);
        }
      }
    }

    const inferredFilters = inferFiltersFromQuery(finalQuery);
    const params = new URLSearchParams();
    if (keepQuery) params.set("query", finalQuery);
    if (inferredFilters.location.length > 0) params.set("location", inferredFilters.location.join(","));
    if (inferredFilters.jobType.length > 0) params.set("jobType", inferredFilters.jobType.join(","));
    if (inferredFilters.salary.length > 0) params.set("salary", inferredFilters.salary.join(","));

    await new Promise((resolve) => setTimeout(resolve, 300));
    const q = params.toString();
    navigate(`/browse${q ? `?${q}` : ""}`);
    setIsSearching(false);
    setShowSuggestions(false);
  };

  const fetchSearchHistory = async () => {
    if (!user) return;
    try {
      setIsFetchingHistory(true);
      const res = await axios.get(`${API}/search-history`, { withCredentials: true });
      if (res.data.success) setSearchHistory(res.data.searchHistories || []);
    } catch (error) {
      console.error("Failed to fetch search history:", error);
    } finally {
      setIsFetchingHistory(false);
    }
  };

  useEffect(() => {
    // Đã fix: Reset Index khi gõ text mới
    setActiveSuggestionIndex(-1); 

    if (query.trim()) {
      const timeoutId = setTimeout(async () => {
        try {
          setIsFetchingSuggestions(true);
          const res = await axios.get(`${API}/job/suggestions?keyword=${query}`);
          setSuggestions(res.data.suggestions || []);
        } catch (err) {
          console.error("Failed to fetch suggestions", err);
        } finally {
          setIsFetchingSuggestions(false);
        }
      }, 300);

      setShowSuggestions(true);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      if (isInputFocused && user) {
        setShowSuggestions(true);
        // Đã xóa gọi fetchSearchHistory() ở đây để tránh side-effect thừa
      } else {
        setShowSuggestions(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isInputFocused, user]);

  const handleSelectSuggestion = (item: { title: string }) => {
    setQuery(item.title);
    searchJobHandler(item.title, false);
  };

  const handleSelectHistory = (historyQuery: string) => {
    setQuery(historyQuery);
    searchJobHandler(historyQuery);
  };

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
    searchJobHandler(keyword, false);
  };

  const handleDeleteHistory = async (e: React.MouseEvent, historyId: string) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API}/search-history/${historyId}`, {
        withCredentials: true,
      });
      setSearchHistory((prev) => prev.filter((item) => item._id !== historyId));
    } catch (error) {
      console.error("Failed to delete search history:", error);
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (!query.trim() && user && searchHistory.length === 0) {
      fetchSearchHistory();
    }
    if (!query.trim() && user) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
      if (!query.trim()) setShowSuggestions(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-blue-50/50 to-white py-10 lg:py-16">
      {isSearching && <FullScreenLoader />}

      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* CỘT TRÁI: Nội dung SEO & Tìm kiếm */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
            
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 px-4 py-2 bg-blue-100/50 text-blue-700 rounded-full border border-blue-200 shadow-sm">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold">Cập nhật 1,000+ việc làm hôm nay</span>
            </div>

            {/* Chuẩn SEO H1 & H2 */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-gray-900 tracking-tight">
                Tìm Việc Làm Tại <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Tuyển Dụng Đồng Nai
                </span>
              </h1>
              <h2 className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                Kênh thông tin tuyển dụng uy tín . Cập nhật liên tục việc làm hành chính, kế toán, việc làm tại Đồng Xoài, Bình Phước, KCN và đa dạng ngành nghề khác.
              </h2>
            </div>

            {/* Search Box Gọn Gàng */}
            <div className="relative w-full mt-2">
              <div className="relative bg-white rounded-2xl w-full shadow-lg border border-gray-200/80 focus-within:border-blue-500 transition-colors duration-300">
                <div className="flex items-center p-1.5">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onKeyDown={(e) => {
                        const totalItems = query.trim() ? suggestions.length : searchHistory.length;
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (query.trim()) {
                            if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
                              handleSelectSuggestion(suggestions[activeSuggestionIndex]);
                            } else {
                              searchJobHandler();
                            }
                          } else if (activeSuggestionIndex >= 0 && searchHistory[activeSuggestionIndex]) {
                            handleSelectHistory(searchHistory[activeSuggestionIndex].query);
                          }
                        } else if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setActiveSuggestionIndex((prev) => Math.min(prev + 1, totalItems - 1));
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          setActiveSuggestionIndex((prev) => Math.max(prev - 1, -1));
                        }
                      }}
                      value={query}
                      type="text"
                      placeholder="Tìm theo chức danh, kỹ năng, địa điểm..."
                      className="w-full h-12 sm:h-14 px-4 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 border-none outline-none bg-transparent"
                    />
                  </div>

                  <Button
                    onClick={() => searchJobHandler()}
                    className="h-10 w-10 sm:h-12 sm:w-12 ml-1 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md transition-all duration-300 border-0 flex-shrink-0"
                    disabled={isSearching || !query.trim()}
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Search className="w-5 h-5 text-white" />}
                  </Button>
                </div>
              </div>

              {/* Loading Indicator */}
              {isFetchingSuggestions && (
                <div className="absolute left-4 -bottom-6 flex items-center gap-1.5 text-[10px] sm:text-xs text-blue-600 font-medium z-10">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Đang tìm gợi ý...</span>
                </div>
              )}

              {/* Suggestions / History Dropdown */}
              {showSuggestions && (
                <div ref={suggestionsRef} className="absolute top-full left-0 right-0 z-50 mt-2">
                  {query.trim() ? (
                    <SuggestionList
                      suggestions={suggestions}
                      onSelect={handleSelectSuggestion}
                      keyword={query}
                      activeIndex={activeSuggestionIndex}
                    />
                  ) : (
                    user && (
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden text-sm">
                        <div className="px-4 py-2 border-b border-gray-50 flex items-center gap-2 bg-gray-50">
                          <Clock className="h-3.5 w-3.5 text-gray-500" />
                          <h3 className="font-medium text-xs text-gray-500 uppercase">Lịch sử tìm kiếm</h3>
                        </div>
                        {isFetchingHistory ? (
                          <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-blue-500" /></div>
                        ) : searchHistory.length === 0 ? (
                          <div className="px-4 py-4 text-center text-gray-400 text-xs">Chưa có lịch sử</div>
                        ) : (
                          <ul className="max-h-56 overflow-y-auto">
                            {searchHistory.map((item, index) => (
                              <li
                                key={item._id}
                                onClick={() => handleSelectHistory(item.query)}
                                className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 ${index === activeSuggestionIndex ? "bg-blue-50" : ""}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-700 truncate">{item.query}</span>
                                  <button onClick={(e) => handleDeleteHistory(e, item._id)} className="p-1 hover:bg-gray-200 rounded-full">
                                    <X className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" />
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Từ khóa SEO / Gợi ý tìm kiếm nhanh */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Gợi ý tìm kiếm:
              </div>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => handleKeywordClick(kw)}
                    className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* CỘT PHẢI: Banner Slider - Đã thêm sự kiện hover */}
          <div 
            className="lg:col-span-6 xl:col-span-7 relative order-1 lg:order-2 w-full h-[250px] sm:h-[350px] lg:h-[420px] rounded-3xl overflow-hidden shadow-2xl group"
            onMouseEnter={() => setIsHoveringSlider(true)}
            onMouseLeave={() => setIsHoveringSlider(false)}
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
                  <h3 className="text-xl sm:text-3xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {banner.title}
                  </h3>
                </div>
              </div>
            ))}

            {/* Nút điều hướng Slide (Dots) */}
            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "w-6 bg-blue-500" : "w-1.5 bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Chuyển slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;