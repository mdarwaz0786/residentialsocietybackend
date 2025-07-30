import SearchBar from '../../components/Table/SearchBar'
import Pagination from '../../components/Table/Pagination';
import TableWrapper from '../../components/Table/TableWrapper';
import useFetchData from '../../hooks/useFetchData';
import { useAuth } from '../../context/auth.context';
import PageSizeSelector from '../../components/Table/PageSizeSelector';
import useDelete from '../../hooks/useDelete';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Flat = () => {
  const { validToken } = useAuth();
  const fetchDataUrl = "/api/v1/flat/get-all-flat";
  const singleDeleteUrl = "/api/v1/flat/delete-single-flat";
  const { deleteData, deleteResponse, deleteError } = useDelete();

  const {
    data,
    params,
    setParams,
    refetch,
  } = useFetchData(fetchDataUrl, validToken, {
    page: 1,
    limit: 20,
    isDeleted: false,
    search: "",
  });

  const handleSearch = (value) => {
    setParams({ search: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setParams({ page: newPage });
  };

  const handlePageSizeChange = (newLimit) => {
    setParams({ limit: newLimit, page: 1 });
  };

  const handleDelete = async (id) => {
    await deleteData(`${singleDeleteUrl}/${id}`, validToken);
  };

  useEffect(() => {
    if (deleteResponse?.success) {
      toast.success("Flat Deleted");
      refetch();
    };
  }, [deleteResponse, refetch]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError);
    };
  }, [deleteError]);

  const flats = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>All Flat<span className="badge bg-secondary ms-2">{total}</span></h5>
        <Link to="/create-flat"><button className="btn btn-primary">Add New Flat</button></Link>
        <SearchBar value={params.search} onChange={handleSearch} />
      </div>
      <TableWrapper>
        <thead className="table-dark">
          <tr>
            <th><input type="checkbox" /></th>
            <th>#</th>
            <th>Flat Number</th>
            <th>Flat Type</th>
            <th>Floor</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            flats?.length > 0 ? (
              flats?.map((item, index) => (
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>{index + 1 + (params.page - 1) * params.limit}</td>
                  <td>{item?.flatNumber}</td>
                  <td>{item?.flatType}</td>
                  <td>{item?.floor}</td>
                  <td>
                    <Link to={`/flat-detail/${item?._id}`}><button className="btn btn-secondary me-3 actionBtn">View</button></Link>
                    <Link to={`/update-flat/${item?._id}`}><button className="btn btn-primary me-3 actionBtn">Edit</button></Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(item?._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Data.
                </td>
              </tr>
            )
          }
        </tbody>
      </TableWrapper>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <PageSizeSelector
          value={params.limit}
          onChange={handlePageSizeChange}
          total={total}
        />
        <Pagination
          page={params.page}
          total={total}
          limit={params.limit}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Flat;