import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
// Import thêm Avatar component
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import type { Job } from "@/types/job";
import { AnimatePresence } from "framer-motion";
// Thêm icon Building2 làm dự phòng cuối cùng
import { MapPin, Briefcase, Clock, DollarSign, Award, Building2 } from "lucide-react";

interface LatestJobCardsProps {
  job: Job;
}

const LatestJobCards = ({ job }: LatestJobCardsProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showOnLeft, setShowOnLeft] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Kiểm tra vị trí card để hiển thị panel chi tiết bên trái hay phải
  useEffect(() => {
    const checkPosition = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        setShowOnLeft(rect.right > windowWidth - 300);
      }
    };

    checkPosition();
    window.addEventListener("resize", checkPosition);
    return () => window.removeEventListener("resize", checkPosition);
  }, []);

  return (
    <div className="relative" ref={cardRef}>
      <div
        className="group relative p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/60 overflow-hidden cursor-pointer hover:-translate-y-2 hover:scale-[1.02]"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Floating Particles */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        </div>

        {/* --- CẬP NHẬT: Company Section với Avatar Fallback --- */}
        <div className="relative z-10 mb-5 flex items-start gap-4">
          {/* Box bọc Avatar: Đã bỏ điều kiện check logo để Fallback luôn chạy */}
          <div className="relative shrink-0 bg-white p-1 rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <Avatar className="h-12 w-12 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <AvatarImage
                src={job?.company?.logo}
                alt={`${job?.company?.name} logo`}
                className="object-contain"
              />
              <AvatarFallback className="bg-blue-50 text-blue-700 font-bold text-xl rounded-lg flex items-center justify-center w-full h-full">
                {job?.company?.name
                  ? job.company.name.charAt(0).toUpperCase()
                  : <Building2 className="w-6 h-6 text-blue-500" />}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Cụm Tên công ty & Địa chỉ xếp dọc */}
          <div className="flex flex-col justify-center min-w-0 pt-0.5">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 truncate">
              {job?.company?.name}
            </h3>
            
            <div 
              className="flex items-center gap-1.5 mt-1.5 text-gray-500 w-fit max-w-full"
              title={job?.location}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
              <span className="truncate text-sm">{job?.location}</span>
            </div>
          </div>
        </div>
        {/* -------------------------------------- */}

        {/* Job Title & Description */}
        <div className="relative z-10 mb-6 mt-2">
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
            {job?.title}
          </h2>
          <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
            {job?.description}
          </p>
        </div>

        {/* Enhanced Badges */}
        <div className="relative z-10 flex flex-wrap gap-2 mb-6">
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-medium px-3 py-1 rounded-full transition-all duration-300">
            {job?.position} vị trí
          </Badge>
          <Badge className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 font-medium px-3 py-1 rounded-full transition-all duration-300">
            {job?.jobType}
          </Badge>
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 font-medium px-3 py-1 rounded-full transition-all duration-300">
            {job?.salary} triệu
          </Badge>
        </div>

        {/* Apply Button */}
        <Link to={`/job/detail/${job?.slug}`} className="relative z-10">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-xl transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg font-medium">
            Ứng tuyển ngay
          </Button>
        </Link>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
      </div>

      {/* Details Panel */}
      <AnimatePresence>
        {showDetails && (
          <div
            className={`absolute top-0 ${
              showOnLeft ? "right-full mr-4" : "left-full ml-4"
            } max-w-xs w-[350px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/60 z-50 overflow-hidden`}
            style={{ overflowX: "hidden" }}
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
          >
            {/* Panel Header */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200/60">
              <div className="flex items-center gap-2 mb-2">
                {/* CẬP NHẬT: Avatar Fallback cho Panel */}
                <Avatar className="h-8 w-8 rounded-lg shadow-sm border border-gray-100 bg-white">
                  <AvatarImage
                    src={job?.company?.logo}
                    alt={`${job?.company?.name} logo`}
                    className="object-contain p-0.5"
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-sm rounded-lg flex items-center justify-center w-full h-full">
                    {job?.company?.name
                      ? job.company.name.charAt(0).toUpperCase()
                      : <Building2 className="w-4 h-4 text-blue-500" />}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                  {job?.company?.name}
                </h3>
              </div>
              <h4 className="text-lg font-semibold text-blue-600 mb-1 line-clamp-1">
                {job?.title}
              </h4>
              <div className="flex items-center text-sm text-gray-500 gap-1">
                <MapPin size={14} className="text-gray-400 shrink-0" />
                <span className="line-clamp-1">{job?.location}</span>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-4 max-h-[300px] overflow-y-auto">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 p-2 bg-blue-50/50 rounded-lg">
                  <Briefcase size={16} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-700">Vị trí:</span>{" "}
                    <span className="text-gray-600">{job?.position} vị trí</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-purple-50/50 rounded-lg">
                  <Clock size={16} className="text-purple-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-700">Loại hình:</span>{" "}
                    <span className="text-gray-600">{job?.jobType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-green-50/50 rounded-lg">
                  <DollarSign size={16} className="text-green-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-700">Lương:</span>{" "}
                    <span className="text-gray-600">{job?.salary} triệu</span>
                  </div>
                </div>

                {job?.experienceLevel && (
                  <div className="flex items-center gap-2 p-2 bg-orange-50/50 rounded-lg">
                    <Award size={16} className="text-orange-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">Kinh nghiệm:</span>{" "}
                      <span className="text-gray-600">{job?.experienceLevel}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200">
                  <div className="font-medium text-gray-700 mb-1">Mô tả công việc:</div>
                  <p className="text-gray-600 line-clamp-3 text-xs leading-relaxed">
                    {job?.description}
                  </p>
                </div>

                {job?.requirements && (
                  <div className="pt-2">
                    <div className="font-medium text-gray-700 mb-1">Yêu cầu:</div>
                    <p className="text-gray-600 line-clamp-3 text-xs leading-relaxed">
                      {job?.requirements}
                    </p>
                  </div>
                )}

                {job?.benefits && (
                  <div className="pt-2">
                    <div className="font-medium text-gray-700 mb-1">Phúc lợi:</div>
                    <p className="text-gray-600 line-clamp-3 text-xs leading-relaxed">
                      {job?.benefits}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2">
                <Link to={`/job/detail/${job?.slug}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-xl transition-all duration-300 cursor-pointer text-sm font-medium shadow-md hover:shadow-lg">
                    Ứng tuyển ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LatestJobCards;