const Pagination = ({ page, total, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="d-flex justify-content-end align-items-center">
      <button
        className="btn btn-primary btn-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      <span className="mx-3">
        Page {page} of {totalPages}
      </span>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
