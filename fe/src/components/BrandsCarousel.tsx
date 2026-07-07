import { Badge } from "@/components/ui/badge";
import { Star, Award, TrendingUp, Building2 } from "lucide-react";

const featuredCompanies = [
  {
    name: "Vinfast",
    logo: "vinfast.png",
    isTop: true,
  },
  {
    name: "Huawei",
    logo: "huawei.png",
    isTop: true,
  },
  {
    name: "VNG",
    logo: "vng.png",
    isTop: true,
  },
  {
    name: "LG",
    logo: "lg.png",
    isTop: true,
  },
  {
    name: "Samsung",
    logo: "samsung.png",
    isTop: true,
  },
];

const regularCompanies = [
  { name: "Vinfast", logo: "vinfast.png" },
  { name: "Huawei", logo: "huawei.png" },
  { name: "Samsung", logo: "samsung.png" },
  { name: "VNG", logo: "vng.png" },
  { name: "LG", logo: "lg.png" },
  { name: "MB Bank", logo: "mb_bank.png" },
  { name: "ACB Bank", logo: "acb_bank.png" },
  { name: "Viettel", logo: "viettel.png" },
  { name: "Grab", logo: "grab.png" },
  { name: "Techcombank", logo: "Techcombank.png" },
  { name: "Sun", logo: "sun.png" },
  { name: "Misa", logo: "misa.png" },
];

const BrandCarousel = () => {
  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>

      <div className="py-10 sm:py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="text-center mb-10 sm:mb-12">
            {/* Icon Badge */}
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-slate-900 rounded-xl shadow-sm mb-4 sm:mb-6">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-3 sm:mb-4 text-slate-900">
              Nhà tuyển dụng <span className="text-slate-600">nổi bật</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
              Khám phá cơ hội nghề nghiệp tại các công ty hàng đầu Việt Nam
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span>
                  <strong className="text-slate-900">
                    {featuredCompanies.length}
                  </strong>{" "}
                  công ty hàng đầu
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>
                  <strong className="text-slate-900">
                    {regularCompanies.length}+
                  </strong>{" "}
                  đối tác tin cậy
                </span>
              </div>
            </div>
          </div>

          {/* Featured Companies Section */}
          <div className="mb-10 sm:mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-sm border border-slate-200/60">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg sm:rounded-xl shadow-sm">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900">
                    Công ty hàng đầu
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">
                    Những nhà tuyển dụng uy tín và chất lượng cao
                  </p>
                </div>
              </div>

              {/* Updated Grid: Fix 5 columns, shrink on mobile */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-4 mb-4 sm:mb-8">
                {featuredCompanies.map((company, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <div className="bg-white border border-gray-200 rounded-md sm:rounded-lg p-1.5 sm:p-6 hover:shadow-md transition-all duration-300 h-14 sm:h-24 md:h-32 flex items-center justify-center">
                      {company.isTop && (
                        <Badge className="absolute -top-2 -right-1 sm:-right-2 bg-green-500 hover:bg-green-600 text-white text-[8px] sm:text-xs px-1 py-0 sm:px-2 sm:py-1 z-10 leading-tight border-none">
                          TOP
                        </Badge>
                      )}
                      <img
                        src={company.logo || "/placeholder.svg"}
                        alt={`${company.name} logo`}
                        className="object-contain max-w-full max-h-full scale-90 sm:scale-100 group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regular Companies Marquee Section */}
          <div className="bg-gradient-to-br from-slate-100/50 to-blue-100/30 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-sm border border-slate-200/60">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg sm:rounded-xl shadow-sm">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900">
                  Đối tác tin cậy
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 sm:mt-1">
                  Mạng lưới đối tác rộng khắp trên toàn quốc
                </p>
              </div>
            </div>

            <div className="overflow-hidden bg-white/60 backdrop-blur-sm py-4 sm:py-6 rounded-xl relative border border-slate-200/40">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white/80 sm:from-white/60 to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white/80 sm:from-white/60 to-transparent z-10"></div>

              <div className="flex animate-marquee">
                {/* First set of companies */}
                {regularCompanies.map((company, index) => (
                  <div
                    key={`first-${index}`}
                    className="flex-shrink-0 mx-2 sm:mx-3 group cursor-pointer"
                  >
                    <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-lg sm:rounded-xl p-2 sm:p-4 hover:shadow-md transition-all duration-300 h-16 w-24 sm:h-24 sm:w-32 flex items-center justify-center">
                      <img
                        src={company.logo || "/placeholder.svg"}
                        alt={`${company.name} logo`}
                        className="object-contain max-w-full max-h-full transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {regularCompanies.map((company, index) => (
                  <div
                    key={`second-${index}`}
                    className="flex-shrink-0 mx-2 sm:mx-3 group cursor-pointer"
                  >
                    <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-lg sm:rounded-xl p-2 sm:p-4 hover:shadow-md transition-all duration-300 h-16 w-24 sm:h-24 sm:w-32 flex items-center justify-center">
                      <img
                        src={company.logo || "/placeholder.svg"}
                        alt={`${company.name} logo`}
                        className="object-contain max-w-full max-h-full transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandCarousel;