import { useAuth } from "../../context/auth.context";
import useFetch from "../../hooks/useFetch";
import { useParams } from 'react-router-dom';
import Loader from "../../components/Loader/Loader";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

const UserDetail = () => {
  const { id } = useParams();
  const { validToken } = useAuth();
  const apiUrl = id ? `/api/v1/user/get-single-user/${id}` : null;

  const { data, isLoading } = useFetch(apiUrl, validToken);
  const user = data?.data || {};
  const pdfRef = useRef();

  const handleDownloadPDF = () => {
    html2pdf(pdfRef.current, {
      margin: 0.5,
      filename: `${user.fullName}_profile.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="text-dark">User Profile</h5>
            <button className="btn btn-sm btn-primary" onClick={handleDownloadPDF}>Download</button>
          </div>
          <div className="card border-0 shadow p-4" ref={pdfRef}>
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={user?.profilePhoto}
                  alt="Profile"
                  className="rounded-circle border border-primary mb-3"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                <h5 className="text-primary">{user?.fullName}</h5>
              </div>
              <div className="col-md-8">
                <div className="row g-3">
                  <Info label="Mobile" value={user?.mobile} />
                  <Info label="Email" value={user?.email} />
                  <Info label="Member ID" value={user?.memberId} />
                  <Info label="Role" value={user?.role?.roleName || 'N/A'} />
                  <Info label="Active" value={user?.isActive ? 'Yes' : 'No'} badge={user?.isActive ? 'success' : 'secondary'} />
                  <Info label="Deleted" value={user?.isDeleted ? 'Yes' : 'No'} badge={user?.isDeleted ? 'danger' : 'success'} />
                  <Info label="Status" value={user?.status} badge={`${getStatusColor(user?.status)}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Info = ({ label, value, badge }) => (
  <div className="col-sm-6">
    <div className="border p-2 rounded bg-light">
      <strong>{label}:</strong>{" "}
      {badge ? <span className={`badge bg-${badge}`}>{value}</span> : value}
    </div>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case "Approved": return "success";
    case "Rejected": return "danger";
    default: return "warning";
  };
};

export default UserDetail;
