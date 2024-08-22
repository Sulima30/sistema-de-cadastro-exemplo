import React from 'react';

const Pagination = ({ page, totalItems, itemsPerPage, setPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <nav className="dataTable-pagination">
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
            Anterior
          </button>
        </li>
        {[...Array(totalPages).keys()].map(num => (
          <li key={num + 1} className={`page-item ${page === num + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => setPage(num + 1)}>
              {num + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            Próximo
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
