import { IconChevronLeft, IconChevronRight, IconDots } from "@tabler/icons-react";
import { Button } from "./ui/button.tsx";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  pageRangeDisplayed: number;
  onChange: (pageNumber: number) => void;
  // linkGenerator?: (pageNumber: number) => string;
};

export const Pagination = ({
  totalPages,
  currentPage,
  pageRangeDisplayed,
  onChange,
}: PaginationProps) => {
  const middlePage = Math.ceil(pageRangeDisplayed / 2);

  // 左側ページの始まりを計算
  let leftPage = currentPage - middlePage + 1;
  if (totalPages - leftPage < pageRangeDisplayed) {
    leftPage = totalPages - pageRangeDisplayed + 1;
  }
  leftPage = Math.max(1, leftPage);

  // 右側ページの終わりを計算
  const rightPage = Math.min(totalPages, leftPage + pageRangeDisplayed - 1);

  // ページ番号を格納する配列を作成
  const pageNumbers = [];
  for (let i = leftPage; i <= rightPage; i++) {
    pageNumbers.push(i);
  }

  // 前のページに移動するための関数
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onChange(currentPage - 1);
    }
  };

  // 次のページに移動するための関数
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
        <Button
        disabled={currentPage === 1}
          aria-label="前に戻る"
          onClick={goToPreviousPage}
          variant="outline"
          size="icon"
        >
          <IconChevronLeft />
        </Button>

      <div className="flex items-center space-x-2">
        {pageNumbers[0] > 1 && (
          <>
            <Button
              onClick={() => onChange(1)}
              variant="outline"
              
              >
              {1}
            </Button>
          </>
        )}
                    <span className=" font-semibold py-2 ">
              <IconDots />
            </span>
        {pageNumbers.map((pageNumber, index) => (
          <Button
          variant="outline"
            key={index}
            // to={linkGenerator(pageNumber)}
            onClick={() => onChange(pageNumber)}
            disabled={pageNumber === currentPage}
          >
            {pageNumber}
          </Button>
        ))}
          <span className=" font-semibold py-2 ">
            <IconDots />
          </span>
      </div>
      <div className="flex items-center space-x-2">
        {currentPage < totalPages - 1 && (
          <>
            <Button
              onClick={() => onChange(totalPages)}
              variant="outline"
              
              >
              {totalPages}
            </Button>
          </>
        )}
        </div>
        <Button
        disabled={currentPage === totalPages}
        variant="outline"
          aria-label="次に進む"
          onClick={goToNextPage}
          size="icon"
        >
          <IconChevronRight />
        </Button>
    </div>
  );
};