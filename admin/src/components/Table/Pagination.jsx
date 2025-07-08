import React from "react";

const Pagination = ({ page, total, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  const pageNumbers = [];

  // Generate a range of page numbers (current ±2)
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="d-flex justify-content-end mt-4">
      <ul className="pagination pagination-sm mb-0">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>
            &laquo;
          </button>
        </li>

        {page > 3 && totalPages > 5 && (
          <li className="page-item">
            <button className="page-link" onClick={() => onPageChange(1)}>
              1
            </button>
          </li>
        )}

        {page > 4 && <li className="page-item disabled"><span className="page-link">...</span></li>}

        {pageNumbers.map((num) => (
          <li key={num} className={`page-item ${num === page ? "active" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(num)}>
              {num}
            </button>
          </li>
        ))}

        {page < totalPages - 3 && <li className="page-item disabled"><span className="page-link">...</span></li>}

        {page < totalPages - 2 && totalPages > 5 && (
          <li className="page-item">
            <button className="page-link" onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </li>
        )}

        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
