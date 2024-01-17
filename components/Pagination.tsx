import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center my-4 space-x-2">
  {pages.map((page) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 focus:outline-none transition-colors duration-200 ease-in-out ${
        page === currentPage ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
      }`}
    >
      {page}
    </button>
  ))}
</div>
  );
};

export default Pagination;
