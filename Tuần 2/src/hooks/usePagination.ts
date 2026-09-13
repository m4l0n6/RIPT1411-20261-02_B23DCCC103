import { useState } from "react";

function usePagination<T>(data: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = data.slice(startIndex, endIndex);

  const next = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    currentData,
    next,
    prev,
    goToPage,
  };
}

export default usePagination;
