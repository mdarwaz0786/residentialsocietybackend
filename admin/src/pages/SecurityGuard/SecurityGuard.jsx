/* eslint-disable react-hooks/exhaustive-deps */
import SearchBar from '../../components/Table/SearchBar'
import Pagination from '../../components/Table/Pagination';
import TableWrapper from '../../components/Table/TableWrapper';
import useFetchData from '../../hooks/useFetchData';
import { useAuth } from '../../context/auth.context';
import PageSizeSelector from '../../components/Table/PageSizeSelector';
import useDelete from '../../hooks/useDelete';
import { toast } from "react-toastify";
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import useUpdateStatus from '../../hooks/useUpdateStatus';
import StatusUpdateForm from '../../components/Form/StatusUpdateForm';

const SecurityGuard = () => {
  const { validToken } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const fetchDataUrl = "/api/v1/securityGuard/get-all-securityGuard";
  const singleDeleteUrl = "/api/v1/securityGuard/delete-single-securityGuard";
  const { deleteData, deleteResponse, deleteError } = useDelete();

  const {
    data,
    params,
    setParams,
    refetch,
  } = useFetchData(fetchDataUrl, validToken, { page, limit, search });

  useEffect(() => {
    setParams({ page, limit, search });
  }, [page, limit, search]);

  const {
    status,
    approving,
    handleStatusChange,
    updateStatus,
  } = useUpdateStatus({ token: validToken, refetch });

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

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to permanently delete this seccurity guard?");
    if (!confirmed) return;
    await deleteData(`${singleDeleteUrl}/${id}`, validToken);
  };

  useEffect(() => {
    if (deleteResponse?.success) {
      toast.success("Deleted successful");
      refetch();
    };
  }, [deleteResponse]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError);
    };
  }, [deleteError]);

  const securityGuards = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>All Security Guard<span className="badge bg-secondary ms-2">{total}</span></h5>
        <Link to="/create-security-guard"><button className="btn btn-primary">Add New Security Guard</button></Link>
        <SearchBar value={params.search} onChange={handleSearch} />
      </div>
      <TableWrapper>
        <thead className="table-dark">
          <tr>
            <th><input type="checkbox" /></th>
            <th>#</th>
            <th>Photo</th>
            <th>Full Name</th>
            <th>Mobile</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            securityGuards?.length > 0 ? (
              securityGuards?.map((item, index) => (
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>{index + 1 + (params.page - 1) * params.limit}</td>
                  <td><img className="profile-photo" src={item?.profilePhoto} alt="profile-photo" /></td>
                  <td>{item?.fullName}</td>
                  <td>{item?.mobile}</td>
                  <td>
                    <StatusUpdateForm
                      id={item?._id}
                      currentStatus={item?.status}
                      status={status}
                      approving={approving}
                      onChange={handleStatusChange}
                      onSubmit={(id) => updateStatus("/api/v1/securityGuard/update-securityGuard", id)}
                    />
                  </td>
                  <td>
                    <Link to={`/security-guard-detail/${item?._id}`}><button className="btn btn-secondary me-3 actionBtn">View</button></Link>
                    <Link to={`/update-security-guard/${item?._id}`}><button className="btn btn-primary me-3 actionBtn">Edit</button></Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(item?._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No Data
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

export default SecurityGuard;