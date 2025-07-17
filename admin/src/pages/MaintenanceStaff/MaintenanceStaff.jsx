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

const MaintenanceStaff = () => {
  const { validToken } = useAuth();
  const fetchDataUrl = "/api/v1/maintenanceStaff/get-all-maintenanceStaff";
  const singleDeleteUrl = "/api/v1/maintenanceStaff/delete-single-maintenanceStaff";
  const { deleteData, response, deleteError } = useDelete();

  const {
    data,
    params,
    setParams,
    refetch,
  } = useFetchData(fetchDataUrl, validToken, {
    page: 1,
    limit: 10,
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

  const maintenanceStaffs = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>All Maintenance Staff<span className="badge bg-secondary ms-2">{total}</span></h5>
        <Link to="/create-maintenance-staff"><button className="btn btn-primary btn-sm">Add New Maintenance Staff</button></Link>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            maintenanceStaffs?.length > 0 ? (
              maintenanceStaffs?.map((item, index) => (
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>{index + 1 + (params.page - 1) * params.limit}</td>
                  <td>{item?.fullName}</td>
                  <td>{item?.mobile}</td>
                  <td>{item?.email}</td>
                  <td>
                    <Link to={`/maintenance-staff-detail/${item?._id}`}><button className="btn btn-secondary btn-sm me-3 actionBtn">View</button></Link>
                    <Link to={`/update-maintenance-staff/${item?._id}`}><button className="btn btn-primary btn-sm me-3 actionBtn">Edit</button></Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item?._id)}>Delete</button>
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

export default MaintenanceStaff;