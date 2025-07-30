import SearchBar from '../../components/Table/SearchBar'
import Pagination from '../../components/Table/Pagination';
import TableWrapper from '../../components/Table/TableWrapper';
import useFetchData from '../../hooks/useFetchData';
import { useAuth } from '../../context/auth.context';
import PageSizeSelector from '../../components/Table/PageSizeSelector';
import { Link } from 'react-router-dom';

const User = () => {
  const { validToken } = useAuth();
  const fetchDataUrl = "/api/v1/user/get-all-user";

  const {
    data,
    params,
    setParams,
  } = useFetchData(fetchDataUrl, validToken, {
    page: 1,
    limit: 20,
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

  const users = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>All User<span className="badge bg-secondary ms-2">{total}</span></h5>
        <SearchBar value={params.search} onChange={handleSearch} />
      </div>
      <TableWrapper>
        <thead className="table-dark">
          <tr>
            <th><input type="checkbox" /></th>
            <th>#</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            users?.length > 0 ? (
              users?.map((item, index) => (
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>{index + 1 + (params.page - 1) * params.limit}</td>
                  <td>{item?.fullName}</td>
                  <td>{item?.mobile}</td>
                  <td>{item?.email}</td>
                  <td>{item?.role?.roleName}</td>
                  <td>
                    <Link to={`/user-detail/${item?._id}`}><button className="btn btn-secondary me-3 actionBtn">View</button></Link>
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