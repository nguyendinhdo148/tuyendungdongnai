import { useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Eye,
  Briefcase,
  TrendingUp,
  Crown,
  Shield,
} from "lucide-react";
import type { Company } from "@/types/company";
import type { Job } from "@/types/job";

interface CompanyHeroProps {
  company: Company;
  jobs: Job[];
  viewCount: number;
}

const CompanyHero = ({ company, jobs, viewCount }: CompanyHeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative overflow-hidden" ref={heroRef}>
      {/* Đổi h-[28rem] thành min-h-[28rem] lg:h-[28rem] để mobile ko bị tràn */}
      <div className="min-h-[28rem] lg:h-[28rem] bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5" />

          {/* Floating Particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              <div className="w-1 h-1 bg-white/30 rounded-full" />
            </div>
          ))}

          {/* Geometric Shapes */}
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 h-full">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="border-r border-white/20 h-full" />
              ))}
            </div>
          </div>
        </div>

        {/* Nội dung chính: Thêm pt-24 pb-12 cho mobile để không bị đè bởi Navbar */}
        <div className="container mx-auto px-4 h-full flex items-end pt-24 pb-12 md:pb-16 relative z-10">
          
          {/* Tối ưu Layout: Mobile xếp dọc căn giữa, Desktop xếp ngang căn dưới */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-8 w-full text-center md:text-left">
            
            {/* Avatar - Bo nhỏ trên mobile */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/30 to-white/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              {/* Đổi size-38 thành size-28 cho mobile, md:size-38 cho màn hình lớn */}
              <Avatar className="relative size-28 md:w-[152px] md:h-[152px] rounded-lg border-4 border-white/40 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <AvatarImage
                  src={company.logo || ""}
                  alt={company.name}
                  className="object-contain"
                />
                <AvatarFallback className="bg-white text-emerald-600 text-2xl md:text-3xl font-bold">
                  {company.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {/* Căn lại vị trí crown cho cân xứng với avatar nhỏ */}
              <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 size-8 md:size-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 md:border-4 border-white flex items-center justify-center shadow-lg">
                <Crown className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>

            {/* Thông tin chữ */}
            <div className="flex-1 mt-2 md:mt-4 w-full flex flex-col items-center md:items-start">
              
              {/* Tên công ty & Badge */}
              <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3 mb-3 md:mb-4">
                {/* Giảm size chữ mobile xuống 3xl, cho phép line-clamp nếu tên quá dài */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                  {company.name}
                </h1>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors whitespace-nowrap shrink-0">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>

              {/* Hàng thông tin phụ: flex-wrap + whitespace-nowrap để không gãy lộn xộn */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 md:gap-x-6 gap-y-2 text-white/90 mb-4 md:mb-5 text-sm md:text-base">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                  <span className="font-medium truncate max-w-[180px] sm:max-w-none">
                    {company.location || "Chưa cập nhật địa điểm"}
                  </span>
                </div>
                
                {/* Dấu chấm ngăn cách trên Desktop (Ẩn ở mobile nếu xuống dòng) */}
                <div className="hidden sm:block w-1 h-1 rounded-full bg-white/40" />

                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Users className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                  <span className="font-medium">{company.noe} Nhân viên</span>
                </div>

                <div className="hidden sm:block w-1 h-1 rounded-full bg-white/40" />

                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <Eye className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
                  <span className="font-medium">
                    {viewCount.toLocaleString()} lượt xem
                  </span>
                </div>
              </div>

              {/* Hàng Nút Bấm: Cho phép rớt xuống dòng nếu không đủ chỗ */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 mb-2">
                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1.5 md:px-4 md:py-2 whitespace-nowrap text-xs md:text-sm">
                  <Briefcase className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5" />
                  {jobs.length} việc làm
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1.5 md:px-4 md:py-2 whitespace-nowrap text-xs md:text-sm">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5" />
                  Đang phát triển
                </Badge>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHero;