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
import useUpdateStatus from '../../hooks/useUpdateStatus';
import StatusUpdateForm from '../../components/Form/StatusUpdateForm';

const FlatOwner = () => {
  const { validToken } = useAuth();
  const fetchDataUrl = "/api/v1/flatOwner/get-all-flatOwner";
  const singleDeleteUrl = "/api/v1/flatOwner/delete-single-flatOwner";
  const { deleteData, response, deleteError } = useDelete();

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

  const {
    status,
    approving,
    handleStatusChange,
    updateStatus,
  } = useUpdateStatus({ token: validToken, refetch });

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
    if (response?.success) {
      toast.success("Deleted successful");
      refetch();
    };
  }, [response, refetch]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError);
    };
  }, [deleteError]);

  const flatOwners = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>All Flat Owner<span className="badge bg-secondary ms-2">{total}</span></h5>
        <Link to="/create-flat-owner"><button className="btn btn-primary">Add New Flat Owner</button></Link>
        <SearchBar value={params.search} onChange={handleSearch} />
      </div>
      <TableWrapper>
        <thead className="table-dark">
          <tr>
            <th><input type="checkbox" /></th>
            <th>#</th>
            <th>Profile Photo</th>
            <th>Full Name</th>
            <th>Mobile</th>
            <th>Flat</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            flatOwners?.length > 0 ? (
              flatOwners?.map((item, index) => (
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>{index + 1 + (params.page - 1) * params.limit}</td>
                  <td><img className="profile-photo" src={item?.profilePhoto} alt="profile-photo" /></td>
                  <td>{item?.fullName}</td>
                  <td>{item?.mobile}</td>
                  <td>{item?.flat?.flatNumber}</td>
                  <td>
                    <StatusUpdateForm
                      id={item?._id}
                      currentStatus={item?.status}
                      status={status}
                      approving={approving}
                      onChange={handleStatusChange}
                      onSubmit={(id) => updateStatus("/api/v1/flatOwner/update-flatOwner", id)}
                    />
                  </td>
                  <td>
                    <Link to={`/flat-owner-detail/${item?._id}`}><button className="btn btn-secondary me-3 actionBtn">View</button></Link>
                    <Link to={`/update-flat-owner/${item?._id}`}><button className="btn btn-primary me-3 actionBtn">Edit</button></Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(item?._id)}>Delete</button>
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

export default FlatOwner;