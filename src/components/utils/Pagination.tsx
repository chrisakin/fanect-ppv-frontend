import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationIndexProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationIndex = ({ currentPage, totalPages, onPageChange }: PaginationIndexProps): JSX.Element => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={`w-8 h-8 flex items-center justify-center ${
                currentPage === i 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800'
              } rounded-md text-sm text-foreground cursor-pointer`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            className={`w-8 h-8 flex items-center justify-center ${
              currentPage === 1 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800'
            } rounded-md text-sm text-foreground cursor-pointer`}
            onClick={() => onPageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Add ellipsis if needed
      if (currentPage > 3) {
        pages.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground" />
          </PaginationItem>
        );
      }

      // Add pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={`w-8 h-8 flex items-center justify-center ${
                currentPage === i 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800'
              } rounded-md text-sm text-foreground cursor-pointer`}
              onClick={() => onPageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Add ellipsis if needed
      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground" />
          </PaginationItem>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              className={`w-8 h-8 flex items-center justify-center ${
                currentPage === totalPages 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800'
              } rounded-md text-sm text-foreground cursor-pointer`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center w-full py-8">
      <Pagination>
        <PaginationContent className="flex items-center gap-2 flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              className={`flex items-center gap-1 px-2 py-1 ${
                currentPage === 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
              } bg-gray-100 dark:bg-gray-800 rounded-md border border-solid border-[#d5d7da] text-foreground`}
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            >
              <ChevronLeftIcon className="w-3 h-3" />
            </PaginationPrevious>
          </PaginationItem>

          {renderPageNumbers()}

          <PaginationItem>
            <PaginationNext
              className={`flex items-center gap-1 px-2 py-1 ${
                currentPage === totalPages 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
              } bg-gray-100 dark:bg-gray-800 rounded-md border border-solid border-[#d5d7da] text-foreground`}
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            >
              <ChevronRightIcon className="w-3 h-3" />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};