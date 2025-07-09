import SearchBar from '../../components/Table/SearchBar'
import Pagination from '../../components/Table/Pagination';
import TableWrapper from '../../components/Table/TableWrapper';
import useFetchData from '../../hooks/useFetchData';
import { useAuth } from '../../context/auth.context';
import PageSizeSelector from '../../components/Table/PageSizeSelector';
import useDelete from '../../hooks/useDelete';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

const User = () => {
  const { validToken } = useAuth();
  const fetchDataUrl = "/api/v1/user/get-all-user";
  const singleDeleteUrl = "/api/v1/user/delete-single-user";
  const { deleteData } = useDelete();

  const {
    data,
    params,
    setParams,
    refetch,
  } = useFetchData(fetchDataUrl, validToken, {
    page: 1,
    limit: 10,
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
    toast.success("Deleted successful");
    refetch();
  };

  const users = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>All User</h5>
        <SearchBar value={params.search} onChange={handleSearch} />
      </div>
      <TableWrapper>
        <thead className="table-dark">
          <tr>
            <th><input type="checkbox" /></th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            users?.length > 0 ? (
              users?.map((item) => (
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>{item?.fullName}</td>
                  <td>{item?.mobile}</td>
                  <td>{item?.email}</td>
                  <td>
                    <Link to={`/user-detail/${item?._id}`}><button className="btn btn-secondary btn-sm me-3 actionBtn">View</button></Link>
                    <button className="btn btn-primary btn-sm me-3 actionBtn">Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item?._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
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

export default User;