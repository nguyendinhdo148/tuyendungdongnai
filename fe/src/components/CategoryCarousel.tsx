import { useEffect, useRef, useCallback, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/carousel";
import {
  Factory,
  Calculator,
  Users,
  Utensils,
  Coffee,
  Store,
  Headset,
  Truck,
  ShieldCheck,
  Wrench,
  Monitor,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dữ liệu ngành nghề chuẩn theo thị trường Đồng Nai / Bình Phước
const category = [
  {
    name: "Công nhân sản xuất",
    icon: Factory,
    color: "from-blue-500 to-cyan-400",
    description: "Lắp ráp, Đóng gói, Vận hành",
    demand: "Very High",
  },
  {
    name: "Kế toán / Kiểm toán",
    icon: Calculator,
    color: "from-emerald-500 to-teal-400",
    description: "Thu ngân, Kế toán kho, Thuế",
    demand: "High",
  },
  {
    name: "Hành chính nhân sự",
    icon: Users,
    color: "from-purple-500 to-pink-400",
    description: "Tuyển dụng, Văn thư, C&B",
    demand: "Medium",
  },
  {
    name: "Phục vụ / Phụ bếp",
    icon: Utensils,
    color: "from-orange-500 to-amber-400",
    description: "Nhà hàng, Quán ăn, Sự kiện",
    demand: "Very High",
  },
  {
    name: "Bán hàng / Kinh doanh",
    icon: Store,
    color: "from-indigo-500 to-blue-400",
    description: "Tư vấn, Chốt sale, Khảo sát",
    demand: "High",
  },
  {
    name: "Chăm sóc khách hàng",
    icon: Headset,
    color: "from-pink-500 to-rose-400",
    description: "Trực tổng đài, Giải đáp",
    demand: "Medium",
  },
  {
    name: "Tài xế / Giao hàng",
    icon: Truck,
    color: "from-violet-500 to-purple-400",
    description: "Lái xe tải, Giao nhận hàng",
    demand: "High",
  },
  {
    name: "Bảo vệ / An ninh",
    icon: ShieldCheck,
    color: "from-teal-500 to-cyan-400",
    description: "Tuần tra, Giám sát camera",
    demand: "Medium",
  },
  {
    name: "Cơ khí / Bảo trì",
    icon: Wrench,
    color: "from-red-500 to-pink-400",
    description: "Sửa chữa máy móc, Điện lạnh",
    demand: "High",
  },
  {
    name: "Pha chế / Barista",
    icon: Coffee,
    color: "from-yellow-500 to-orange-400",
    description: "Quán Cafe, Trà sữa",
    demand: "High",
  },
  {
    name: "IT / Phần mềm",
    icon: Monitor,
    color: "from-slate-600 to-gray-400",
    description: "Hỗ trợ kỹ thuật, Lập trình",
    demand: "Medium",
  },
];

const CategoryCarousel = () => {
  const carouselRef = useRef<CarouselApi | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setIsAutoPlaying] = useState(true);

  const navigate = useNavigate();

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    setIsAutoPlaying(true);
    intervalRef.current = setInterval(() => {
      carouselRef.current?.scrollNext();
    }, 4000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsAutoPlaying(false);
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (!carouselRef.current) return;

    const updateSlide = () => {
      if (carouselRef.current) {
        setCurrentSlide(carouselRef.current.selectedScrollSnap());
      }
    };

    carouselRef.current.on("select", updateSlide);

    return () => {
      carouselRef.current?.off("select", updateSlide);
    };
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    
    setTimeout(() => {
      // Đã sửa 'query' thành 'jobType' để khớp với bộ lọc ngành nghề
      navigate(`/browse?jobType=${encodeURIComponent(categoryName)}`);
      setSelectedCategory(null);
    }, 300);
  };

  const getDemandBadgeColor = (demand: string) => {
    switch (demand) {
      case "Very High":
        return "bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-sm shadow-green-200";
      case "High":
        return "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-sm shadow-blue-200";
      case "Medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-400 text-white shadow-sm shadow-orange-200";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="relative py-8 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 h-60 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div
        className="relative max-w-6xl mx-auto"
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1.5 mb-4 shadow-sm">
            <Briefcase size={14} className="text-blue-600" />
            <span className="text-xs font-medium text-gray-700">
              Nhóm ngành nổi bật
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
            Khám phá cơ hội nghề nghiệp
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
            Lựa chọn ngành nghề phù hợp để xem ngay các việc làm đang tuyển dụng
          </p>
        </div>

        <Carousel
          setApi={(api) => (carouselRef.current = api)}
          opts={{
            loop: true,
            align: "center",
            skipSnaps: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {category.map((cate, index) => (
              <CarouselItem
                key={index}
                className="pl-3 basis-[240px] sm:basis-[260px] md:basis-[280px] lg:basis-[300px]"
              >
                <div className="group h-full">
                  <div
                    onClick={() => handleCategoryClick(cate.name)}
                    className={`
                      relative h-40 bg-white border border-gray-200/60 
                      rounded-2xl shadow-md hover:shadow-lg
                      transition-all duration-300 ease-out cursor-pointer
                      hover:-translate-y-1 overflow-hidden
                      ${
                        selectedCategory === cate.name
                          ? "scale-95 opacity-80"
                          : "hover:scale-[1.02]"
                      }
                    `}
                  >
                    <div
                      className={`
                      absolute inset-0 bg-gradient-to-br ${cate.color} 
                      opacity-0 group-hover:opacity-10 
                      transition-opacity duration-500
                    `}
                    ></div>

                    <div className="absolute top-3 right-3">
                      <div
                        className={`
                        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-semibold uppercase tracking-wider
                        ${getDemandBadgeColor(cate.demand)}
                      `}
                      >
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                        {cate.demand === "Very High" ? "Tuyển dụng nhiều" : cate.demand === "High" ? "Nhu cầu cao" : "Tuyển dụng đều"}
                      </div>
                    </div>

                    <div className="relative p-4 sm:p-5 h-full flex flex-col justify-between">
                      <div className="space-y-3">
                        <div
                          className={`
                          inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 
                          bg-gradient-to-br ${cate.color} rounded-xl
                          group-hover:rotate-6 group-hover:scale-110
                          transition-all duration-500 shadow-md
                        `}
                        >
                          <cate.icon
                            size={22}
                            className="text-white drop-shadow-md"
                          />
                        </div>

                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 group-hover:text-blue-700 transition-colors">
                            {cate.name}
                          </h3>
                          <p className="text-gray-500 text-[10px] sm:text-xs font-medium line-clamp-1">
                            {cate.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-[10px] text-gray-400 font-medium group-hover:text-transparent transition-colors">
                          Click để xem việc làm
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-xs font-semibold">
                            Tìm việc ngay
                          </span>
                          <ArrowRight
                            size={14}
                            className="group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="
            hidden sm:flex -left-3 md:-left-8 w-10 h-10 md:w-11 md:h-11 
            bg-white/90 backdrop-blur-md border-2 border-gray-200/60
            hover:bg-white hover:border-blue-400 hover:text-blue-600 hover:scale-110
            transition-all duration-300 shadow-lg
            disabled:opacity-30
          "
          />
          <CarouselNext
            className="
            hidden sm:flex -right-3 md:-right-8 w-10 h-10 md:w-11 md:h-11 
            bg-white/90 backdrop-blur-md border-2 border-gray-200/60
            hover:bg-white hover:border-blue-400 hover:text-blue-600 hover:scale-110
            transition-all duration-300 shadow-lg
            disabled:opacity-30
          "
          />
        </Carousel>

        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({
            length: Math.min(6, Math.ceil(category.length / 2)),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => carouselRef.current?.scrollTo(index * 2)}
              className={`
                h-1 rounded-full transition-all duration-500
                ${
                  Math.floor(currentSlide / 2) === index
                    ? "bg-blue-600 w-5 shadow-md"
                    : "bg-gray-300 w-1.5 hover:bg-gray-400"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;