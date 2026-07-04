import { FileSearch } from "lucide-react";

const NoJobFound = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center h-[60vh] text-gray-500">
      <FileSearch size={56} className="mb-4 text-gray-400" />
      <p className="text-xl font-semibold">Không có bài tuyển dụng nào phù hợp</p>
      <p className="text-sm text-center mt-1 max-w-md">
        Hãy thử điều chỉnh lại bộ lọc tìm kiếm hoặc từ khóa để tìm được công việc phù hợp hơn.
      </p>
    </div>
  );
};

export default NoJobFound;
