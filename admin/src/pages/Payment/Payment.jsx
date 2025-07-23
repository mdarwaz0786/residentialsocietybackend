import SearchBar from '../../components/Table/SearchBar'
import Pagination from '../../components/Table/Pagination';
import TableWrapper from '../../components/Table/TableWrapper';
import useFetchData from '../../hooks/useFetchData';
import { useAuth } from '../../context/auth.context';
import PageSizeSelector from '../../components/Table/PageSizeSelector';
import { Link } from 'react-router-dom';

const Payment = () => {
  const { validToken } = useAuth();
  const fetchDataUrl = "/api/v1/tenantRegistrationPayment/get-all-tenantRegistrationPayment";

  const {
    data,
    params,
    setParams,
  } = useFetchData(fetchDataUrl, validToken, {
    page: 1,
    limit: 20,
    isDeleted: false,
    status: "success",
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

  const payments = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>All Tenant<span className="badge bg-secondary ms-2">{total}</span></h5>
        <SearchBar value={params.search} onChange={handleSearch} />
      </div>
      <TableWrapper>
        <thead className="table-dark">
          <tr>
            <th><input type="checkbox" /></th>
            <th>#</th>
            <th>T. Id</th>
            <th>Flat</th>
            <th>Tenant</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            payments?.length > 0 ? (
              payments?.map((item, index) => (
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>{index + 1 + (params.page - 1) * params.limit}</td>
                  <td>{item?.txnid}</td>
                  <td>{item?.flat?.flatNumber}</td>
                  <td>{item?.tenant?.fullName}</td>
                  <td>{item?.amount}</td>
                  <td>{item?.status}</td>
                  <td>
                    <Link to={`/payment-detail/${item?._id}`}><button className="btn btn-secondary me-3 actionBtn">View</button></Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
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

export default Payment;