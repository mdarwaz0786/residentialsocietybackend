import SearchBar from '../../components/Table/SearchBar'
import Pagination from '../../components/Table/Pagination';
import TableWrapper from '../../components/Table/TableWrapper';
import useFetchData from '../../hooks/useFetchData';
import { useAuth } from '../../context/auth.context';
import PageSizeSelector from '../../components/Table/PageSizeSelector';
import useDelete from '../../hooks/useDelete';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import useUpdateStatus from '../../hooks/useUpdateStatus';
import StatusUpdateForm from '../../components/Form/StatusUpdateForm';

const Vehicle = () => {
  const { validToken } = useAuth();
  const fetchDataUrl = "/api/v1/vehicle/get-all-vehicle";
  const singleDeleteUrl = "/api/v1/vehicle/delete-single-vehicle";
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
    toast.success("Deleted successful");
    refetch();
  };

  const vehicles = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>All Vehicle<span className="badge bg-secondary ms-2">{total}</span></h5>
        <SearchBar value={params.search} onChange={handleSearch} />
      </div>
      <TableWrapper>
        <thead className="table-dark">
          <tr>
            <th><input type="checkbox" /></th>
            <th>#</th>
            <th>Vehicle Photo</th>
            <th>Vehicle Number</th>
            <th>Vehicle Owner</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            vehicles?.length > 0 ? (
              vehicles?.map((item, index) => (
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>{index + 1 + (params.page - 1) * params.limit}</td>
                  <td><img className="profile-photo" src={item?.vehiclePhoto} alt="vehicle-photo" /></td>
                  <td>{item?.vehicleNumber}</td>
                  <td>{item?.createdBy?.fullName}</td>
                  <td>
                    <StatusUpdateForm
                      id={item?._id}
                      currentStatus={item?.status}
                      status={status}
                      approving={approving}
                      onChange={handleStatusChange}
                      onSubmit={(id) => updateStatus("/api/v1/vehicle/update-vehicle", id)}
                    />
                  </td>
                  <td>
                    <Link to={`/vehicle-detail/${item?._id}`}><button className="btn btn-secondary me-3 actionBtn">View</button></Link>
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

export default Vehicle;