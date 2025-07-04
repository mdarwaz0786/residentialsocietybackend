import React, { useState } from 'react';
import styles from '../../shared/styles/TableStyles.module.css';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const navigation = useNavigate();

  const initialProducts = [
    { id: 1, name: 'iPhone 14', price: 999, visible: true },
    { id: 2, name: 'Samsung S23', price: 899, visible: true },
    { id: 3, name: 'OnePlus 11', price: 799, visible: false },
    { id: 4, name: 'Google Pixel 7', price: 699, visible: true },
    { id: 5, name: 'Sony WH-1000XM5', price: 349, visible: true },
    { id: 6, name: 'Apple MacBook Pro 14"', price: 1999, visible: true },
    { id: 7, name: 'Dell XPS 13', price: 1299, visible: false },
    { id: 8, name: 'Samsung Galaxy Tab S8', price: 749, visible: true },
    { id: 9, name: 'iPad Air', price: 599, visible: false },
    { id: 10, name: 'Fitbit Versa 4', price: 229, visible: true },
    { id: 11, name: 'GoPro Hero 11', price: 499, visible: true },
    { id: 12, name: 'Canon EOS R10', price: 979, visible: false },
    { id: 13, name: 'Nikon Z50', price: 899, visible: true },
    { id: 14, name: 'Sony PlayStation 5', price: 499, visible: true },
    { id: 15, name: 'Xbox Series X', price: 499, visible: false },
    { id: 16, name: 'Apple Watch Series 8', price: 399, visible: true },
    { id: 17, name: 'Bose QuietComfort Earbuds II', price: 299, visible: true },
    { id: 18, name: 'Amazon Echo Show 10', price: 249, visible: false },
    { id: 19, name: 'Google Nest Thermostat', price: 129, visible: true },
    { id: 20, name: 'Logitech MX Master 3', price: 99, visible: true },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleToggle = (id) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, visible: !prod.visible } : prod
      )
    );
  };

  const handleDeleteSelected = () => {
    setProducts((prev) => prev.filter((prod) => !selected.includes(prod.id)));
    setSelected([]);
  };

  const handleEdit = (id) => {
    alert(`Edit product with ID: ${id}`);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleBack = () => {
    navigation(-1);
  };

  const handleSelectAll = () => {
    if (selected.length === products.length) {
      setSelected([]);
    } else {
      setSelected(products.map((p) => p.id));
    };
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className={`container ${styles.tableWrapper}`}>
      <div className="d-flex justify-content-between mb-4">
        <h5 className="text-center">Product List</h5>
        <button className="btn btn-light text-dark border" onClick={handleBack}>
          ← Back
        </button>
      </div>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          placeholder="Search products..."
          className="form-control w-25"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          className="btn btn-danger btn-sm ms-3"
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
        >
          Delete Selected
        </button>
      </div>

      <div className={`table-responsive ${styles.scrollWrapper}`}>
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selected.length === products.length && products.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Visibility</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(prod.id)}
                      onChange={() => handleSelect(prod.id)}
                    />
                  </td>
                  <td>{prod.name}</td>
                  <td>{prod.price}</td>
                  <td>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={prod.visible}
                        onChange={() => handleToggle(prod.id)}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={prod.visible ? 'text-success fw-bold' : 'text-muted'}>
                      {prod.visible ? 'Show' : 'Hide'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-secondary btn-sm me-3 ${styles.actionBtn}`}
                    >
                      View
                    </button>
                    <button
                      className={`btn btn-primary btn-sm me-3 ${styles.actionBtn}`}
                      onClick={() => handleEdit(prod.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(prod.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No matching products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <label className="me-2">Show:</label>
          <select value={pageSize} onChange={handlePageSizeChange} className="form-select d-inline w-auto">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>
        <div>
          <button
            className="btn btn-outline-primary btn-sm me-2"
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
          >
            Previous
          </button>
          <span className="me-2">Page {currentPage} of {totalPages}</span>
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={currentPage === totalPages}
            onClick={goToNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
