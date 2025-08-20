import TableWrapper from '../../components/Table/TableWrapper';
import useFetchData from '../../hooks/useFetchData';
import { useAuth } from '../../context/auth.context';
import { Link } from 'react-router-dom';

const Setting = () => {
  const { validToken } = useAuth();
  const fetchDataUrl = "/api/v1/setting/get-all-setting";

  const {
    data,
    isLoading,
  } = useFetchData(fetchDataUrl, validToken, {});

  const settings = data?.data || [];

  return (
    <div className="container mt-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Setting</h5>
      </div>
      <TableWrapper>
        <thead className="table-dark">
          <tr>
            <th><input type="checkbox" /></th>
            <th>#</th>
            <th>App Name</th>
            <th>App Version</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            settings?.length > 0 ? (
              settings?.map((item, index) => (
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>{index + 1}</td>
                  <td>{item?.appName}</td>
                  <td>{item?.appVersion}</td>
                  <td>
                    <Link to={`/update-setting/${item?._id}`}><button className="btn btn-primary actionBtn">Edit</button></Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  {isLoading ? "Loading..." : " No Data"}
                </td>
              </tr>
            )
          }
        </tbody>
      </TableWrapper>
    </div>
  );
};

export default Setting;