/* eslint-disable react-hooks/exhaustive-deps */
import SearchBar from '../../components/Table/SearchBar'
import Pagination from '../../components/Table/Pagination';
import TableWrapper from '../../components/Table/TableWrapper';
import useFetchData from '../../hooks/useFetchData';
import { useAuth } from '../../context/auth.context';
import PageSizeSelector from '../../components/Table/PageSizeSelector';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const TenantRegistrationPayment = () => {
  const { validToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const fetchDataUrl = "/api/v1/tenantRegistrationPayment/get-all-tenantRegistrationPayment";

  const {
    data,
    params,
    setParams,
    isLoading,
  } = useFetchData(fetchDataUrl, validToken, { page, limit, status: "success", search });

  useEffect(() => {
    setParams({ page, limit, search });
  }, [page, limit, search]);

  const updateQueryParams = (updates = {}) => {
    const updatedParams = {
      page,
      limit,
      search,
      ...updates,
    };
    setSearchParams(updatedParams);
  };

  const handleSearch = (value) => {
    updateQueryParams({ search: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateQueryParams({ page: newPage });
  };

  const handlePageSizeChange = (newLimit) => {
    updateQueryParams({ limit: newLimit, page: 1 });
  };

  const payments = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>All Tenant Registration Payment<span className="badge bg-secondary ms-2">{total}</span></h5>
        <SearchBar value={params.search} onChange={handleSearch} />
      </div>
      <TableWrapper>
        <thead className="table-dark">
          <tr>
            <th><input type="checkbox" /></th>
            <th>#</th>
            <th>Transaction Id</th>
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
                  {isLoading ? "Loading..." : " No Data"}
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

export default TenantRegistrationPayment;