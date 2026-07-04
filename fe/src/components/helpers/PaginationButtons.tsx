import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationButtons = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationButtonsProps) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Hiển thị tất cả nếu ít hơn 7 trang
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu, cuối và gần currentPage
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (typeof page === "string") {
        return (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-gray-400 text-sm select-none"
          >
            ...
          </span>
        );
      }

      const isActive = page === currentPage;
      return (
        <Button
          key={page}
          size="sm"
          variant={isActive ? "default" : "outline"}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
            isActive
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow"
              : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
          )}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      );
    });
  };

  return (
    <div className="flex justify-center mt-6 gap-2 items-center">
      <Button
        size="sm"
        variant="outline"
        className="cursor-pointer bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Trước
      </Button>

      {renderPageNumbers()}

      <Button
        size="sm"
        variant="outline"
        className="cursor-pointer bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Kế tiếp →
      </Button>
    </div>
  );
};
