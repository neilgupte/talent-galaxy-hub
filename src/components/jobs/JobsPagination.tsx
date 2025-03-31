
import React from 'react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface JobsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const JobsPagination: React.FC<JobsPaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  
  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const renderPaginationItems = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <PaginationItem key={page}>
          <PaginationLink 
            isActive={currentPage === page}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ));
    } else {
      const items = [];
      
      items.push(
        <PaginationItem key="first">
          <PaginationLink 
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
      
      return items;
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="my-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        {renderPaginationItems()}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default JobsPagination;
