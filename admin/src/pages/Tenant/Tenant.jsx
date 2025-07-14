import SearchBar from '../../components/Table/SearchBar'
import Pagination from '../../components/Table/Pagination';
import TableWrapper from '../../components/Table/TableWrapper';
import PageSizeSelector from '../../components/Table/PageSizeSelector';
import { Link } from 'react-router-dom';

const Tenant = () => {
  const total = 0;
  const data = [];

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>All Tenant<span className="badge bg-secondary ms-2">{total}</span></h5>
        <Link to="#"><button className="btn btn-primary btn-sm">Add New Tenant</button></Link>
        <SearchBar />
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
            data?.length > 0 ? (
              data?.map((item, index) => (
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>{index + 1 + 1 * 1}</td>
                  <td>{item?.user?.fullName}</td>
                  <td>{item?.user?.mobile}</td>
                  <td>{item?.user?.email}</td>
                  <td>
                    <Link to="#"><button className="btn btn-secondary btn-sm me-3 actionBtn">View</button></Link>
                    <Link to="#"><button className="btn btn-primary btn-sm me-3 actionBtn">Edit</button></Link>
                    <button className="btn btn-danger btn-sm">Delete</button>
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
          value={10}
          total={total}
        />
        <Pagination
          page={1}
          total={total}
          limit={10}
        />
      </div>
    </div>
  );
};

export default Tenant;