import { IconChevronLeft, IconChevronRight, IconDots } from "@tabler/icons";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  pageRangeDisplayed: number;
  onChange: (pageNumber: number) => void;
  // linkGenerator?: (pageNumber: number) => string;
};

export const CatPagination = ({
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
        <button
          aria-label="前に戻る"
          // to={linkGenerator(currentPage - 1)}
          onClick={goToPreviousPage}
          className={"btn btn-outline font-semibold py-2   rounded shadow " + `${(currentPage <= 1 ? 'btn-disabled': '')}`}
        >
          <IconChevronLeft />
        </button>

      <div className="flex items-center space-x-2">
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => onChange(1)}
              className={`btn btn-outline font-semibold py-2   rounded shadow`}
            >
              {1}
            </button>
          </>
        )}
                    <span className=" font-semibold py-2 ">
              <IconDots />
            </span>
        {pageNumbers.map((pageNumber, index) => (
          <button
            key={index}
            // to={linkGenerator(pageNumber)}
            onClick={() => onChange(pageNumber)}
            className={`${
              pageNumber === currentPage
                ? "btn-active"
                : " btn-outline"
            } btn font-semibold py-2    rounded shadow`}
          >
            {pageNumber}
          </button>
        ))}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <span className=" font-semibold py-2 ">
            <IconDots />
          </span>
        )}
      </div>

      {currentPage < totalPages && (
        <button
          aria-label="次に進む"
          onClick={goToNextPage}
          className="btn font-semibold py-2  rounded shadow btn-outline"
        >
          <IconChevronRight />
        </button>
      )}
    </div>
  );
};
