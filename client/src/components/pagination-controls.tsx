import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page, last page, and current page
      pages.push(1);
      
      if (currentPage > 2) {
        pages.push('...');
      }
      
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }
      
      if (currentPage < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="mb-4 sm:mb-0">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span>{t("showing")}</span>
          <span className="font-medium mx-1">{Math.min(1, totalPages)}</span>
          <span>{t("to")}</span>
          <span className="font-medium mx-1">{Math.min(10, totalPages)}</span>
          <span>{t("of")}</span>
          <span className="font-medium mx-1">{totalPages}</span>
          <span>{t("results")}</span>
        </p>
      </div>
      
      <div>
        <nav 
          className={`relative z-0 inline-flex rounded-md shadow-sm -space-x-px ${
            isRTL ? "space-x-0 space-x-reverse" : ""
          }`} 
          aria-label="Pagination"
        >
          <Button
            variant="outline"
            size="icon"
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md ${
              isRTL ? "rounded-l-none rounded-r-md" : ""
            } border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50`}
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">{t("previous")}</span>
            {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
          
          {pageNumbers.map((page, index) => (
            typeof page === 'number' ? (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                className={`relative inline-flex items-center px-4 py-2 border ${
                  page === currentPage
                    ? "text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ) : (
              <Button
                key={index}
                variant="outline"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700"
                disabled
              >
                {page}
              </Button>
            )
          ))}
          
          <Button
            variant="outline"
            size="icon"
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md ${
              isRTL ? "rounded-r-none rounded-l-md" : ""
            } border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50`}
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">{t("next")}</span>
            {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </nav>
      </div>
    </div>
  );
}
