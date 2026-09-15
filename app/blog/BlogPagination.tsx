type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
};

function pageHref(page: number) {
  return page === 1 ? "/blog" : `/blog/page/${page}`;
}

export default function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  return <nav className="blog-pagination" aria-label="Blog pages">
    <div className="blog-pagination-status">Page {currentPage} of {totalPages}</div>
    <div className="blog-pagination-links">
      {currentPage > 1 ? <a href={pageHref(currentPage - 1)} aria-label="Previous blog page">← Previous</a> : <span className="disabled" aria-disabled="true">← Previous</span>}
      <div className="blog-pagination-numbers" aria-label="Choose a blog page">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => page === currentPage ? <span className="current" aria-current="page" key={page}>{page}</span> : <a href={pageHref(page)} key={page}>{page}</a>)}
      </div>
      {currentPage < totalPages ? <a href={pageHref(currentPage + 1)} aria-label="Next blog page">Next →</a> : <span className="disabled" aria-disabled="true">Next →</span>}
    </div>
  </nav>;
}
