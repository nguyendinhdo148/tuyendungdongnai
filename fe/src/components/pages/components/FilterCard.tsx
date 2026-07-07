import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

const filteredData = [
  {
    label: "Khu vực",
    filterType: "location",
    array: [
  // Khu vực Bình Phước cũ (đơn vị hành chính mới)
  "Phường Đồng Xoài",
  "Phường Bình Phước",
  "Phường Bình Long",
  "Phường Phước Long",
  "Phường Chơn Thành",

  "Xã Đồng Phú",
  "Xã Bù Đăng",
  "Xã Bù Gia Mập",
  "Xã Lộc Ninh",
  "Xã Hớn Quản",
  "Xã Bù Đốp",
  "Xã Phú Riềng",

  // Khu vực Đồng Nai
  "Phường Biên Hòa",
  "Phường Long Khánh",
  "Phường Trảng Dài",
  "Phường Tam Hiệp",
  "Phường Long Bình",
  "Phường Tân Triều",

  "Xã Long Thành",
  "Xã Nhơn Trạch",
  "Xã Trảng Bom",
  "Xã Vĩnh Cửu",
  "Xã Định Quán",
  "Xã Xuân Lộc",
  "Xã Cẩm Mỹ",
  "Xã Thống Nhất",
  "Xã Tân Phú",

  "Khác",
],
  },
  {
    label: "Ngành nghề",
    filterType: "jobType",
    array: [
      "Công nhân sản xuất",
      "Kế toán / Kiểm toán",
      "Hành chính nhân sự",
      "Part-Time",
      "Full-Time",
      "Remote",
      "Internship",
      "Phục vụ / Phụ bếp",
      "Pha chế / Barista",
      "Bán hàng / Kinh doanh",
      "Chăm sóc khách hàng",
      "Tài xế / Giao hàng",
      "Bảo vệ / An ninh",
      "Cơ khí / Bảo trì",
      "IT / Phần mềm",
    ],
  },
  {
    label: "Mức lương",
    filterType: "salary",
    array: [
      "Thỏa thuận",
      "Dưới 5 triệu",
      "5 - 10 triệu",
      "10 - 15 triệu",
      "15 - 20 triệu",
      "Trên 20 triệu",
    ],
  },
];

const FilterCard = ({
  filters,
  onFilterChange,
  onResetFilters,
  onSearchChange,
}: {
  filters: {
    location: string[];
    jobType: string[];
    salary: string[];
  };
  onFilterChange: (type: string, value: string) => void;
  onResetFilters: () => void;
  onSearchChange: (text: string) => void;
}) => {
  return (
    <div className="w-full bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 sticky top-20">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-bold text-base text-gray-800">Bộ lọc tìm kiếm</h1>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:border-red-200 transition-all"
        >
          <Trash2 size={14} />
          Xóa lọc
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên công việc..."
          className="w-full px-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {filteredData.map((section, index) => (
          <div key={index} className="flex flex-col">
            <h2 className="font-semibold text-sm text-gray-800 mb-3 uppercase tracking-wide">
              {section.label}
            </h2>
            <div className="grid grid-cols-1 gap-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              {section.array.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 group">
                  <Checkbox
                    id={`${section.filterType}-${item}`}
                    checked={
                      filters[section.filterType as keyof typeof filters].includes(item)
                    }
                    onCheckedChange={() =>
                      onFilterChange(section.filterType, item)
                    }
                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor={`${section.filterType}-${item}`}
                    className="cursor-pointer text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-200 flex-1"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tùy chọn: Thêm style cho thanh cuộn (scrollbar) gọn đẹp hơn */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default FilterCard;